import { mUser, mUserPromise } from "@/repo/mUser";
import { emailPromise } from "@/lib/email";
import { APIResCode } from "@/enums/APIResCode";
import { ObjectId } from "mongodb";
import { bSignUpReqBodyJSON, validateSignUpReqBodyJSON } from "./validate";
import { envPromise } from "@/lib/env";
import { xNoThrowFn } from "@/lib/xNoThrow";
import { xNextRes } from "@/lib/xNextRes";
import { mEmailVfTokenPromise } from "@/repo/mEmailVfToken";
import { createRoute } from "@/lib/createRoute";
import { parseReqBodyAsJSONObjectFactory } from "@/lib/parseReqBodyAsJSONObject";
import { securityTokenPromise } from "@/lib/securityToken";
import { generateReferralCode } from "@/brands/referralCode";
import { hashPassword } from "@/lib/crypto/password";
// import { generateToken } from "@/lib/securityToken";

// export async function POST(req: NextRequest): Promise<APISignUpSuccessResponse | APISignUpErrorResponse | xAPIErrRes> {}

const verifyCaptcha = async function (captchaRes: string) {
    const env = (await envPromise).ret;

    try {
        const cfRes = await fetch("https://challenges.cloudflare.com/turnstile/v0/siteverify", {
            method: "POST",
            body: JSON.stringify({
                secret: env.CF_TURNSTILE_SECRET_KEY,
                response: captchaRes,
            }),

            headers: {
                "content-type": "application/json",
            },
        });

        const responseObject = (await cfRes.json()) as { success: boolean };

        if (responseObject.success) {
            return xNoThrowFn.ret();
        }

        return xNoThrowFn.err("Captcha failed");
    } catch {
        return xNoThrowFn.err("Failed to fetch cloudflare turnstile verification");
    }
};

export async function createAndInsertEmailVfToken(user: mUser) {
    const securityTokenService = (await securityTokenPromise).ret;
    const token = (await securityTokenService.emailVerificationToken()).ret;
    const expirySeconds = 30 * 60; /* MAGIC NUMBER: 30 MINS */

    const emailVfTokenResult = await mEmailVfTokenPromise;

    if (emailVfTokenResult.err != null) {
        return xNoThrowFn.err({ errCode: APIResCode.Error.DB_CONNECTION_FAILED });
    }

    const mEmailVfToken = emailVfTokenResult.ret;
    const createdAt = new Date();

    const emailVfToken = {
        _id: token,
        userID: user._id,
        email: user.email,
        createdAt,
        expiry: new Date(createdAt.getTime() + expirySeconds * 1000),
    };

    const emailVfTokenInsertResult = await mEmailVfToken.insertOne(emailVfToken);

    if (emailVfTokenInsertResult.err != null) {
        return xNoThrowFn.err({
            msg: "failed to insert 'emailVfToken' to db",
        });
    }

    if (!emailVfTokenInsertResult.ret.acknowledged) {
        return xNoThrowFn.err({
            msg: "failed to ack inserted 'emailVfToken'",
        });
    }

    return xNoThrowFn.ret({
        expirySeconds,
        token: emailVfToken,
    });
}

const postHandler = async function (req: bSignUpReqBodyJSON) {
    // try {
    const CODE = APIResCode.Error.SignUp;
    const { name, email, password, referralCode, captchaRes } = req;

    const captchaVfResult = await verifyCaptcha(captchaRes);

    if (captchaVfResult.err != null) {
        /*
        throw new APISignUpErrorResponse(400, {
            code: APIResCode.Error.SignUp.Captcha.CAPTCHA_FAILED,
            message: "Captcha validation failed",
        });
        */
        return xNoThrowFn.err(xNextRes.newErr({ statusCode: 400, errCode: CODE.Captcha.CAPTCHA_FAILED }));
    }

    // const registryDB = service.mongoDBClient.db("registry");
    // const userCollection = registryDB.collection("users");
    const mUserResult = await mUserPromise;

    if (mUserResult.err != null) {
        return xNoThrowFn.err(xNextRes.newErr({ statusCode: 500, errCode: APIResCode.Error.DB_CONNECTION_FAILED }));
    }

    const mUser = mUserResult.ret;
    const exUserResult = await mUser.findOne({ email });

    if (exUserResult.err != null) {
        return xNoThrowFn.err(xNextRes.newErr({ statusCode: 500, errCode: APIResCode.Error.DB_ERROR }));
    }

    const exUser = exUserResult.ret;

    if (exUser != null) {
        /*
        throw new APISignUpErrorResponse(409, {
            code: APIResCode.Error.SignUp.EMAIL_ALREADY_EXISTS,
            message: "User with email already exists",
        });
        */
        return xNoThrowFn.err(xNextRes.newErr({ statusCode: 409, errCode: CODE.EMAIL_ALREADY_EXISTS }));
    }

    let referredByUserID: ObjectId | undefined;
    const env = (await envPromise).ret;

    // const referralCodeSliced = referralCode.slice(3);

    if (referralCode !== env.ROOT_REFERRAL_CODE) {
        const referredByUserResult = await mUser.findOne({ referralCode: referralCode });

        if (referredByUserResult.err != null) {
            /*
            throw new APISignUpErrorResponse(404, {
                code: APIResCode.Error.SignUp.REFERRAL_CODE_NOT_FOUND,
                message: "Referral code not found",
            });
            */
            return xNoThrowFn.err(xNextRes.newErr({ statusCode: 500, errCode: APIResCode.Error.DB_ERROR }));
        }

        if (referredByUserResult.ret == null) {
            return xNoThrowFn.err(xNextRes.newErr({ statusCode: 400, errCode: CODE.REFERRAL_CODE_NOT_FOUND }));
        }

        referredByUserID = referredByUserResult.ret._id;
    }

    const hashedPassword = (await hashPassword(password)).ret;
    const id = new ObjectId();

    const user: mUser = {
        _id: id,
        email,
        hashedPassword,
        name,
        isVerified: false,
        referredBy: referredByUserID ?? id,
        referralCode: (await generateReferralCode()).ret,
        createdAt: new Date(),
        permissions: {},
    };

    const userInsertResult = await mUser.insertOne(user, {});

    if (userInsertResult.err != null) {
        return xNoThrowFn.err(xNextRes.newErr({ statusCode: 500, errCode: APIResCode.Error.DB_ERROR }));
    }

    if (!userInsertResult.ret.acknowledged) {
        return xNoThrowFn.err(
            xNextRes.newErr({
                statusCode: 500,
                errCode: APIResCode.Error.DB_ERROR,
            }),
        );
    }

    const emailVfTokenResult = await createAndInsertEmailVfToken(user);

    if (emailVfTokenResult.err != null) {
        return xNoThrowFn.err(
            xNextRes.newErr({
                statusCode: 500,
                errCode: APIResCode.Error.DB_ERROR,
            }),
        );
    }

    const { token: emailVfToken, expirySeconds } = emailVfTokenResult.ret;

    // Send verification email
    const emailService = (await emailPromise).ret;
    emailService.sendVfEmail(user, emailVfToken._id.toString("hex"), expirySeconds);

    // return new APISignUpSuccessResponse({ message: "User created successfully", data: { user: { email, name } } });
    return xNoThrowFn.ret(
        xNextRes.new({
            statusCode: 201,
            body: {
                id: user._id.toHexString(),
                email: user.email,
                isVerified: user.isVerified,
                referredBy: user.referredBy.toHexString(),
                createdAt: user.createdAt.toUTCString(),
            },
        }),
    );
    /*
    } catch (err) {
        if (err instanceof APISignUpErrorResponse) {
            return err;
        }

        return new xAPIErrRes(500, {
            code: APIResCode.Error.UNKNOWN_ERROR,
            message: "Oops, unknown server error",
        });
    }
        */
};

export const POST = createRoute({
    reqBodyJSONValidatorFn: validateSignUpReqBodyJSON,
    handlerFn: postHandler,
    reqBodyParserFn: parseReqBodyAsJSONObjectFactory(1024 + 512),
});
