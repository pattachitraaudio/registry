import { NextRequest } from "next/server";
import bcrypt from "bcryptjs";
import crypto from "crypto";
import { mUser } from "@/models/mUser";
import { sendVerificationEmail } from "@/lib/email";
import { APIResCode } from "@/enums/APIResCode";
import { ObjectId } from "mongodb";
import { xAPIErrRes } from "@/types/apiResponse/xAPIRes";

import {
    APISignUpErrorResponse,
    APISignUpSuccessResponse,
    APISignUpFormEmailErrorResponse,
    APISignUpFormNameErrorResponse,
    APISignUpFormPasswordErrorResponse,
    APISignUpFormReferralCodeErrorResponse,
} from "@/types/apiResponse/auth/signUp";

import { ServiceManager } from "@/classes/xServiceManager";

function validateCaptcha(bodyObj: object): { captchaRes: string } {
    const Code = APIResCode.Error.SignUp.Captcha;

    if (!("captchaRes" in bodyObj)) {
        throw new APISignUpErrorResponse(400, {
            code: Code.CAPTCHA_NOT_PRESENT,
            message: "Captcha response not present",
        });
    }

    if (typeof bodyObj["captchaRes"] !== "string") {
        throw new APISignUpErrorResponse(400, {
            code: Code.CAPTCHA_NOT_A_STRING,
            message: "Captcha res must be a string",
        });
    }

    return { captchaRes: bodyObj["captchaRes"] };
}

function validateEmail(bodyObj: object): { email: string } {
    const Code = APIResCode.Error.SignUp.Form.Email;

    if (!("email" in bodyObj)) {
        throw new APISignUpFormEmailErrorResponse({
            code: Code.EMAIL_NOT_PRESENT,
            message: "Email not present",
        });
    }

    const email = bodyObj.email;

    if (typeof email !== "string") {
        throw new APISignUpFormEmailErrorResponse({ code: Code.EMAIL_NOT_A_STRING, message: "Email must be a string" });
    }

    if (!email.match(/^[a-z0-9]+@/)) {
        throw new APISignUpFormEmailErrorResponse({
            code: Code.INVALID_USERNAME,
            message:
                "Email username must contain only letters and numbers (no dots, underscores, or special characters)",
        });
    }

    if (!email.match(/@[a-z0-9]+\./)) {
        throw new APISignUpFormEmailErrorResponse({
            code: Code.INVALID_DOMAIN_NAME,
            message: "Email domain must contain only letters and numbers (no underscores or special characters)",
        });
    }

    if (!email.match(/^[^.]*@[^.]*\.[^.]*$/)) {
        throw new APISignUpFormEmailErrorResponse({
            code: Code.INVALID_DOMAIN_NAME,
            message: "Email must not contain subdomains (format: username@domain.tld)",
        });
    }

    if (!email.match(/^[a-z0-9]+@[a-z0-9]+\.[a-z]{2,}$/)) {
        throw new APISignUpFormEmailErrorResponse({
            code: Code.FAILED_TO_VALIDATE_EMAIL,
            message: "Invalid email address",
        });
    }

    return { email };
}

function validateName(body: object): { name: string } {
    const Code = APIResCode.Error.SignUp.Form.Name;
    if (!("name" in body)) {
        throw new APISignUpFormNameErrorResponse({ code: Code.NAME_NOT_PRESENT, message: "Name is required" });
    }

    const name = body.name;

    console.log("name:", name);

    if (typeof name !== "string") {
        throw new APISignUpFormNameErrorResponse({ code: Code.NAME_NOT_A_STRING, message: "Name must be a string" });
    }

    const trimmedName = name.trim();

    if (trimmedName.length < 2) {
        throw new APISignUpFormNameErrorResponse({
            code: Code.NAME_TOO_SHORT,
            message: "Name must be at least 2 characters",
        });
    }

    if (trimmedName.length > 50) {
        throw new APISignUpFormNameErrorResponse({
            code: Code.NAME_TOO_LONG,
            message: "Name must not exceed 50 characters",
        });
    }

    return { name };
}

function validatePassword(bodyObj: object): { password: string } {
    const Code = APIResCode.Error.SignUp.Form.Password;

    if (!("password" in bodyObj)) {
        throw new APISignUpFormPasswordErrorResponse({
            code: Code.PASSWORD_NOT_PRESENT,
            message: "Password is required",
        });
    }

    const password = bodyObj.password;

    if (typeof password !== "string") {
        throw new APISignUpFormPasswordErrorResponse({
            code: Code.PASSWORD_NOT_A_STRING,
            message: "Password must be a string",
        });
    }

    if (password.length < 8) {
        throw new APISignUpFormPasswordErrorResponse({
            code: Code.PASSWORD_TOO_SHORT,
            message: "Password must be at least 8 characters",
        });
    }

    if (password.length > 64) {
        throw new APISignUpFormPasswordErrorResponse({
            code: Code.PASSWORD_TOO_LONG,
            message: "Password must not exceed 64 characters",
        });
    }

    if (!/[A-Z]/.test(password)) {
        throw new APISignUpFormPasswordErrorResponse({
            code: Code.PASSWORD_MISSING_UPPERCASE,
            message: "Password must contain at least one uppercase letter",
        });
    }

    if (!/[a-z]/.test(password)) {
        throw new APISignUpFormPasswordErrorResponse({
            code: Code.PASSWORD_MISSING_LOWERCASE,
            message: "Password must contain at least one lowercase letter",
        });
    }

    if (!/[0-9]/.test(password)) {
        throw new APISignUpFormPasswordErrorResponse({
            code: Code.PASSWORD_MISSING_NUMBER,
            message: "Password must contain at least one number",
        });
    }

    if (!/[^A-Za-z0-9]/.test(password)) {
        throw new APISignUpFormPasswordErrorResponse({
            code: Code.PASSWORD_MISSING_SPECIAL_CHARACTER,
            message: "Password must contain at least one special character",
        });
    }

    return { password };
}

function validateReferralCode(bodyObj: object): { referralCode: string } {
    const Code = APIResCode.Error.SignUp.Form.ReferralCode;

    if (!("referralCode" in bodyObj)) {
        throw new APISignUpFormReferralCodeErrorResponse({
            code: Code.REFERRAL_CODE_NOT_PRESENT,
            message: "Referral code is required to signUp",
        });
    }

    if (typeof bodyObj["referralCode"] !== "string") {
        throw new APISignUpFormReferralCodeErrorResponse({
            code: Code.REFERRAL_CODE_NOT_A_STRING,
            message: "Referral code must be a string",
        });
    }

    const referralCode = bodyObj.referralCode.toUpperCase();

    if (referralCode.length !== 15) {
        throw new APISignUpFormReferralCodeErrorResponse({
            code: Code.INVALID_REFERRAL_CODE_LENGTH,
            message: "Referral code must be exactly 15 characters",
        });
    }

    if (!referralCode.startsWith("REF")) {
        throw new APISignUpFormReferralCodeErrorResponse({
            code: Code.REFERRAL_CODE_NOT_START_WITH_REF,
            message: "Referral code must start with `REF`",
        });
    }

    return { referralCode: referralCode.slice(3) };
}

export async function POST(req: NextRequest): Promise<APISignUpSuccessResponse | APISignUpErrorResponse | xAPIErrRes> {
    try {
        const bodyObj = await req.json();
        const { name } = validateName(bodyObj);
        const { password } = validatePassword(bodyObj);
        const { email } = validateEmail(bodyObj);
        const { referralCode } = validateReferralCode(bodyObj);
        const { captchaRes } = validateCaptcha(bodyObj);

        const service = await new ServiceManager().setup();

        const res = await fetch("https://challenges.cloudflare.com/turnstile/v0/siteverify", {
            method: "POST",
            body: JSON.stringify({
                //secret: Globals.env.cloudflareTurnstile.SECRET_KEY,
                secret: service.env.CF_TURNSTILE_SECRET_KEY,
                response: captchaRes,
            }),

            headers: {
                "content-type": "application/json",
            },
        });

        const resObj = (await res.json()) as { success: boolean };

        console.log(resObj);
        if (!resObj.success) {
            throw new APISignUpErrorResponse(400, {
                code: APIResCode.Error.SignUp.Captcha.CAPTCHA_FAILED,
                message: "Captcha validation failed",
            });
        }

        const registryDB = service.mongoDBClient.db("registry");
        const userCollection = registryDB.collection("users");
        const exUser = await userCollection.findOne({ email });

        if (exUser) {
            throw new APISignUpErrorResponse(409, {
                code: APIResCode.Error.SignUp.EMAIL_ALREADY_EXISTS,
                message: "User with email already exists",
            });
        }

        let referredBy: ObjectId | undefined;

        if (referralCode !== service.env.ROOT_REFERRAL_CODE) {
            const referredByUser = await userCollection.findOne({ referralCode });

            if (!referredByUser) {
                throw new APISignUpErrorResponse(404, {
                    code: APIResCode.Error.SignUp.REFERRAL_CODE_NOT_FOUND,
                    message: "Referral code not found",
                });
            }

            referredBy = referredByUser._id;
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const createdAt = new Date();

        const id = new ObjectId();
        const user: mUser = {
            _id: id,
            email,
            password: hashedPassword,
            name,
            isVerified: false,
            referredBy: referredBy || id,
            referralCode: crypto.randomBytes(6).toString("hex").toUpperCase(),
            createdAt: new Date(),
            permissions: {},
        };

        const result = await userCollection.insertOne(user, {});

        const emailVfToken = new ObjectId(crypto.randomBytes(12));
        const emailVfTokExpSecs = 15 * 60; // 15 minutes

        const emailVfTokensCollection = registryDB.collection("emailVfTokens");
        emailVfTokensCollection.insertOne(
            {
                _id: emailVfToken,
                userID: result.insertedId,
                createdAt,
                expiry: new Date(createdAt.getTime() + emailVfTokExpSecs * 1000),
            },
            {},
        );

        // Send verification email
        sendVerificationEmail(email, name, emailVfToken.toHexString(), emailVfTokExpSecs).then((success) => {
            if (!success) {
                console.error("[[ ERROR ]] Failed to send verification email");
            }
        });

        return new APISignUpSuccessResponse({ message: "User created successfully", data: { user: { email, name } } });
    } catch (err) {
        if (err instanceof APISignUpErrorResponse) {
            return err;
        }

        return new xAPIErrRes(500, {
            code: APIResCode.Error.UNKNOWN_ERROR,
            message: "Oops, unknown server error",
        });
    }
}
