import bcrypt from "bcryptjs";

import { APIResCode } from "@/enums/APIResCode";
import { xAPIErrRes } from "@/types/apiResponse/xAPIRes";

import {
    APILoginErrorResponse,
    APILoginFormEmailErrorResponse,
    APILoginFormPasswordErrorResponse,
    APILoginSuccessResponse,
} from "@/types/apiResponse/auth/login";

import { ServiceManager } from "@/classes/xServiceManager";
import { mUser } from "@/models/mUser";
import { NextRequest, NextResponse } from "next/server";

function validateEmail(body: object): { email: string } {
    const Code = APIResCode.Error.Login.Form.Email;

    if (!("email" in body)) {
        throw new APILoginFormEmailErrorResponse({ code: Code.EMAIL_NOT_PRESENT, message: "Email not present" });
    }

    const email = body.email;

    if (typeof email !== "string") {
        throw new APILoginFormEmailErrorResponse({ code: Code.EMAIL_NOT_A_STRING, message: "Email must be a string" });
    }

    if (!email.match(/^[a-z0-9]+@/)) {
        throw new APILoginFormEmailErrorResponse({
            code: Code.INVALID_USERNAME,
            message:
                "Email username must contain only letters and numbers (no dots, underscores, or special characters)",
        });
    }

    if (!email.match(/@[a-z0-9]+\./)) {
        throw new APILoginFormEmailErrorResponse({
            code: Code.INVALID_DOMAIN_NAME,
            message: "Email domain must contain only letters and numbers (no underscores or special characters)",
        });
    }

    if (!email.match(/^[^.]*@[^.]*\.[^.]*$/)) {
        throw new APILoginFormEmailErrorResponse({
            code: Code.INVALID_DOMAIN_NAME,
            message: "Email must not contain subdomains (format: username@domain.tld)",
        });
    }

    if (!email.match(/^[a-z0-9]+@[a-z0-9]+\.[a-z]{2,}$/)) {
        throw new APILoginFormEmailErrorResponse({
            code: Code.FAILED_TO_VALIDATE_EMAIL,
            message: "Invalid email address",
        });
    }

    return { email };
}

function validatePassword(body: object): { password: string } {
    const Code = APIResCode.Error.Login.Form.Password;

    if (!("password" in body)) {
        throw new APILoginFormPasswordErrorResponse({
            code: Code.PASSWORD_NOT_PRESENT,
            message: "Password is required",
        });
    }

    const password = body.password;

    if (typeof password !== "string") {
        throw new APILoginFormPasswordErrorResponse({
            code: Code.PASSWORD_NOT_A_STRING,
            message: "Password must be a string",
        });
    }

    if (password.length < 8) {
        throw new APILoginFormPasswordErrorResponse({
            code: Code.PASSWORD_TOO_SHORT,
            message: "Password must be at least 8 characters",
        });
    }

    if (password.length > 64) {
        throw new APILoginFormPasswordErrorResponse({
            code: Code.PASSWORD_TOO_LONG,
            message: "Password must not exceed 64 characters",
        });
    }

    if (!/[A-Z]/.test(password)) {
        throw new APILoginFormPasswordErrorResponse({
            code: Code.PASSWORD_MISSING_UPPERCASE,
            message: "Password must contain at least one uppercase letter",
        });
    }

    if (!/[a-z]/.test(password)) {
        throw new APILoginFormPasswordErrorResponse({
            code: Code.PASSWORD_MISSING_LOWERCASE,
            message: "Password must contain at least one lowercase letter",
        });
    }

    if (!/[0-9]/.test(password)) {
        throw new APILoginFormPasswordErrorResponse({
            code: Code.PASSWORD_MISSING_NUMBER,
            message: "Password must contain at least one number",
        });
    }

    if (!/[^A-Za-z0-9]/.test(password)) {
        throw new APILoginFormPasswordErrorResponse({
            code: Code.PASSWORD_MISSING_SPECIAL_CHARACTER,
            message: "Password must contain at least one special character",
        });
    }

    return { password };
}

// export type PostLoginRouteHandlerReturnType = IAPILoginSuccessResponse | IAPILoginErrorResponse | iAPIErrRes;

export async function POST(
    request: NextRequest,
): Promise<APILoginSuccessResponse | APILoginErrorResponse | xAPIErrRes> {
    try {
        const body = await request.json();

        const { email } = validateEmail(body);
        const { password } = validatePassword(body);

        // const users = Globals.mongoDB.users();
        const userCollection = (await new ServiceManager().setup()).mongoDBClient
            .db("registry")
            .collection<mUser>("users");
        const user = await userCollection.findOne({ email: email });

        if (!user) {
            throw new APILoginErrorResponse(401, {
                code: APIResCode.Error.Login.EMAIL_NOT_FOUND,
                message: `No user with email \`${email}\` found`,
            });
        }

        const isValidPass = await bcrypt.compare(password, user.password);

        if (!isValidPass) {
            throw new APILoginErrorResponse(401, {
                code: APIResCode.Error.Login.INCORRECT_PASSWORD,
                message: "Incorrect password",
            });
        }

        // Check if email is verified
        if (!user.isVerified) {
            throw new APILoginErrorResponse(403, {
                code: APIResCode.Error.Login.EMAIL_NOT_VERIFIED,
                message: "Verify your email before logging in",
            });
        }

        const cookieManager = (await new ServiceManager().setup()).cookieManager;
        const cookie = await cookieManager.create(user);

        return new APILoginSuccessResponse([["Set-Cookie", cookie]], {
            data: {
                user: {
                    email: user.email,
                    name: user.name,
                },
            },
            message: "Logged in successfully",
        });
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
}
