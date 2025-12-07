import crypto from "node:crypto";
import { APIResCode } from "@/enums/APIResCode";
import { Brand, tJObject } from "@/lib/util";
import { xNoThrowFn } from "@/lib/xNoThrow";

export type bReferralCode = Brand<`REF${string}`, "ReferralCode">;

export async function validateReferralCode(body: tJObject) {
    const CODE = APIResCode.Error.BRAND.REFERRAL_CODE;

    if (!("referralCode" in body)) {
        /*
        throw new APISignUpFormReferralCodeErrorResponse({
            code: Code.PRESENT,
            message: "Referral code is required to signUp",
        });
        */
        return xNoThrowFn.err(CODE.PRESENT);
    }

    if (typeof body["referralCode"] !== "string") {
        /*
        throw new APISignUpFormReferralCodeErrorResponse({
            code: Code.A_STRING,
            message: "Referral code must be a string",
        });
        */
        return xNoThrowFn.err(CODE.A_STRING);
    }

    const referralCode = body.referralCode.toUpperCase();

    if (referralCode.length !== 15 && referralCode.length !== 35) {
        /*
        throw new APISignUpFormReferralCodeErrorResponse({
            code: Code.INVALID_REFERRAL_CODE_LENGTH,
            message: "Referral code must be exactly 15 characters",
        });
        */
        console.log(referralCode, referralCode.length);
        return xNoThrowFn.err(CODE.INVALID_REFERRAL_CODE_LENGTH);
    }

    if (!referralCode.startsWith("REF")) {
        /*
        throw new APISignUpFormReferralCodeErrorResponse({
            code: Code.START_WITH_REF,
            message: "Referral code must start with `REF`",
        });
        */
        return xNoThrowFn.err(CODE.START_WITH_REF);
    }

    return xNoThrowFn.ret(referralCode as bReferralCode);
}

export async function generateReferralCode() {
    const referralCode = "REF" + crypto.randomBytes(6).toString("hex").toUpperCase();
    return xNoThrowFn.ret(referralCode as bReferralCode);
}
