import { APIResCode } from "@/enums/APIResCode";
import { Brand } from "@/lib/util";
import { xNoThrowFn } from "@/lib/xNoThrow";

export type bCaptcha = Brand<string, "Captcha">;

export async function validateCaptcha(body: object) {
    const Code = APIResCode.Error.BRAND.CAPTCHA;

    if (!("captchaRes" in body)) {
        /*
        throw new APISignUpErrorResponse(400, {
            code: Code.CAPTCHA_NOT_PRESENT,
            message: "Captcha response not present",
        });
        */
        return xNoThrowFn.err(Code.CAPTCHA_NOT_PRESENT);
    }

    if (typeof body["captchaRes"] !== "string") {
        /*
        throw new APISignUpErrorResponse(400, {
            code: Code.CAPTCHA_NOT_A_STRING,
            message: "Captcha res must be a string",
        });
        */
        return xNoThrowFn.err(Code.CAPTCHA_NOT_A_STRING);
    }

    return xNoThrowFn.ret(body["captchaRes"] as bCaptcha);
}
