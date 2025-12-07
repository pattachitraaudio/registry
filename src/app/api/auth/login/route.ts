// import bcrypt from "bcryptjs";

import { APIResCode } from "@/enums/APIResCode";
import { bLoginReq, validateLoginReqBodyJSON } from "./validate";
import { xNextRes } from "@/lib/xNextRes";
import { createRoute } from "@/lib/createRoute";
import { sessionPromise } from "@/lib/session";
import { xNoThrowFn } from "@/lib/xNoThrow";
import { mUser, mUserPromise } from "@/repo/mUser";
import { mEmailVfTokenPromise } from "@/repo/mEmailVfToken";
import { createAndInsertEmailVfToken } from "../signUp/route";
import { emailPromise } from "@/lib/email";
import { comparePasswordHash } from "@/lib/crypto/password";
import { sendVerificationEmail } from "../resendVfEmail/route";

const postHandler = async function (req: bLoginReq) {
    // try {
    const CODE = APIResCode.Error.Login;
    const { email, password } = req;

    const mUserResult = await mUserPromise;

    if (mUserResult.err != null) {
        /*
        return xNoThrowFn.err(
            xNextRes.new({ statusCode: 500, body: { errCode: APIResCode.Error.DB_CONNECTION_FAILED } }),
        );
        */
        return xNoThrowFn.err(xNextRes.newErr({ statusCode: 500, errCode: APIResCode.Error.DB_CONNECTION_FAILED })); // This one uses the new convention!
    }

    const mUser = mUserResult.ret;
    const userResult = await mUser.findOne({ email });

    if (userResult.err != null) {
        return xNoThrowFn.err(xNextRes.newErr({ statusCode: 500, errCode: APIResCode.Error.DB_ERROR }));
    }

    const user = userResult.ret;

    if (!user) {
        /*
            throw new APILoginErrorResponse(401, {
                code: APIResCode.Error.Login.EMAIL_NOT_FOUND,
                message: `No user with email \`${email}\` found`,
            });
            */
        return xNoThrowFn.ret(xNextRes.newErr({ statusCode: 401, errCode: CODE.EMAIL_NOT_FOUND }));
    }

    // const isValidPass = await bcrypt.compare(password, user.password);
    console.log("password:", password, "hashedPassword:", user.hashedPassword);
    const isValidPass = (await comparePasswordHash(password, user.hashedPassword)).ret;

    if (!isValidPass) {
        /*
            throw new APILoginErrorResponse(401, {
                code: APIResCode.Error.Login.INCORRECT_PASSWORD,
                message: "Incorrect password",
            });
            */
        return xNoThrowFn.ret(xNextRes.newErr({ statusCode: 401, errCode: CODE.INCORRECT_PASSWORD }));
    }

    // Check if email is verified
    if (!user.isVerified) {
        sendVerificationEmail(user);
        return xNoThrowFn.ret(xNextRes.newErr({ statusCode: 403, errCode: CODE.EMAIL_NOT_VERIFIED }));
    }

    // const cookieManager = (await new ServiceManager().setup()).cookieManager;
    // const cookie = await cookieManager.create(user);
    // const cookie = (await cookiePromise).create()

    /*
        return new APILoginSuccessResponse([["Set-Cookie", cookie]], {
            data: {
                user: {
                    email: user.email,
                    name: user.name,
                },
            },
            message: "Logged in successfully",
        });
        */
    const cookie = await (await sessionPromise).ret.create(user);

    return xNoThrowFn.ret(
        xNextRes.new({
            statusCode: 200,
            headers: [["Set-Cookie", cookie]],
            body: {
                user: {
                    email: user.email,
                    name: user.name,
                },
            },
        }),
    );
    /*
    } catch (err) {
        if (err instanceof xAPIErrRes) {
            return err;
        }

        return new xAPIErrRes(500, {
            code: APIResCode.Error.UNKNOWN_ERROR,
            message:
                "Whoa, server has encountered an unknown error. If you see this message, please report to the administrator",
        });
    }
        */
};
// Note: Don't use the satisfies keyword. It widens types in this case!
//  satisfies tHandlerFn<bLoginReq>;

export const POST = createRoute({
    handlerFn: postHandler,
    reqBodyJSONValidatorFn: validateLoginReqBodyJSON,
});
