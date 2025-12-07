/*
import { NextResponse } from "next/server";
import crypto from "crypto";
import clientPromise from "@/lib/mongoDB";
import { User } from "@/models/mUser";
import { sendVerificationEmail } from "@/lib/email";

export async function POST(request: Request) {
    try {
        const { email } = await request.json();

        if (!email) {
            return NextResponse.json({ error: "Email is required" }, { status: 400 });
        }

        const client = await clientPromise;
        const db = client.db();
        const usersCollection = db.collection<User>("users");

        const user = await usersCollection.findOne({ email });

        if (!user) {
            return NextResponse.json({ error: "User not found" }, { status: 404 });
        }

        if (user.isVerified) {
            return NextResponse.json({ error: "Email is already verified" }, { status: 400 });
        }

        // Generate new verification token
        const verificationToken = crypto.randomBytes(32).toString("hex");
        const verificationTokenExpiry = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours

        await usersCollection.updateOne(
            { _id: user._id },
            {
                $set: {
                    verificationToken,
                    verificationTokenExpiry,
                },
            },
        );

        // Send verification email
        const emailResult = await sendVerificationEmail(email, user.name, verificationToken);

        if (!emailResult.success) {
            return NextResponse.json({ error: "Failed to send verification email" }, { status: 500 });
        }

        return NextResponse.json(
            {
                message: "Verification email sent successfully",
            },
            { status: 200 },
        );
    } catch (error) {
        console.error("Resend verification error:", error);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}

*/
import { APIResCode } from "@/enums/APIResCode";
// import { NextResponse } from "next/server";
import { bResendVfEmailReqBodyJSON, validateResendVfEmailReqBodyJSON } from "./validate";
import { mEmailVfTokenPromise } from "@/repo/mEmailVfToken";
import { xNoThrowFn } from "@/lib/xNoThrow";
import { xNextRes } from "@/lib/xNextRes";
import { mUser, mUserPromise } from "@/repo/mUser";
import { createAndInsertEmailVfToken } from "../signUp/route";
import { emailPromise } from "@/lib/email";
import { createRoute } from "@/lib/createRoute";

/*
export async function POST(request: Request) {
    return NextResponse.json({ status: APIResCode.WORK_IN_PROGRESS, message: "Work in progress" }, { status: 404 });
}

*/

const postHandler = async function (req: bResendVfEmailReqBodyJSON) {
    const CODE = APIResCode.Error.ResendVfEmail;
    const { email } = req;

    const mUserResult = await mUserPromise;

    if (mUserResult.err != null) {
        return xNoThrowFn.err(xNextRes.newErr({ statusCode: 500, errCode: APIResCode.Error.DB_CONNECTION_FAILED }));
    }

    const mUser = mUserResult.ret;

    const userResult = await mUser.findOne({ email });

    if (userResult.err != null) {
        return xNoThrowFn.err(xNextRes.newErr({ statusCode: 500, errCode: APIResCode.Error.DB_ERROR }));
    }

    const user = userResult.ret;

    if (user == null) {
        return xNoThrowFn.err(xNextRes.newErr({ statusCode: 404, errCode: CODE.USER_NOT_FOUND }));
    }

    if (user.isVerified) {
        return xNoThrowFn.err(
            xNextRes.newErr({
                statusCode: 409,
                errCode: CODE.USER_ALREADY_VERIFIED,
            }),
        );
    }
    /*
    const mEmailVfTokenResult = (await mEmailVfTokenPromise);

    if(mEmailVfTokenResult.err != null) {
        return xNoThrowFn.err(xNextRes.newErr({ statusCode: 500, errCode: APIResCode.Error.DB_CONNECTION_FAILED}));
    }

    const mEmailVfToken = mEmailVfTokenResult.ret;

    const vfTokenFindResult = await mEmailVfToken.findOne({  email });

    if(vfTokenFindResult.err != null) {
        return xNoThrowFn.err(xNextRes.newErr({
            statusCode: 500,
            errCode: APIResCode.Error.DB_ERROR
        }))
    }

    const vfToken = vfTokenFindResult.ret;
    /*

    // if(vfToken == null || Date.now() > (new Date(vfToken.expiry)).getTime() + 1000 * 5 * 60 5 mins ) {
        
    // }
    */
    const result = await sendVerificationEmail(user);

    if (result.err != null) {
        return result;
    }

    return xNoThrowFn.ret(xNextRes.new({ statusCode: 200, body: {} }));
};

export async function sendVerificationEmail(user: mUser) {
    /*
            throw new APILoginErrorResponse(403, {
                code: APIResCode.Error.Login.EMAIL_NOT_VERIFIED,
                message: "Verify your email before logging in",
            });
            */

    const mEmailVfTokenResult = await mEmailVfTokenPromise;

    if (mEmailVfTokenResult.err != null) {
        return xNoThrowFn.ret(
            xNextRes.newErr({
                statusCode: 500,
                errCode: APIResCode.Error.DB_CONNECTION_FAILED,
            }),
        );
    }

    const mEmailVfToken = mEmailVfTokenResult.ret;
    const vfTokenResult = await mEmailVfToken.findOne({ userID: user._id });

    if (vfTokenResult.err != null) {
        return xNoThrowFn.ret(
            xNextRes.newErr({
                statusCode: 500,
                errCode: APIResCode.Error.DB_ERROR,
            }),
        );
    }

    let emailVfToken = vfTokenResult.ret;
    let gen: boolean = false;

    if (emailVfToken != null && emailVfToken.expiry.getTime() + 5 * 60 * 1000 /* 5 mins */ < Date.now()) {
        mEmailVfToken.deleteOne({ _id: emailVfToken._id });
        gen = true;
    }

    if (emailVfToken == null || gen) {
        const emailVfTokenInsertResult = await createAndInsertEmailVfToken(user);

        if (emailVfTokenInsertResult.err != null) {
            return xNoThrowFn.err(
                xNextRes.newErr({
                    statusCode: 500,
                    errCode: APIResCode.Error.DB_ERROR,
                }),
            );
        }

        emailVfToken = emailVfTokenInsertResult.ret.token;
    }

    const emailService = (await emailPromise).ret;
    const expirySeconds = (emailVfToken.expiry.getTime() - emailVfToken.createdAt.getTime()) / 1000;

    emailService.sendVfEmail(user, emailVfToken._id.toString("hex"), expirySeconds);

    return xNoThrowFn.ret();
}

export const POST = createRoute({
    handlerFn: postHandler,
    reqBodyJSONValidatorFn: validateResendVfEmailReqBodyJSON,
});
