import { APIResCode } from "@/enums/APIResCode";
import { Brand, tJObject } from "@/lib/util";
import { xNoThrowFn } from "@/lib/xNoThrow";

export type bEmail = Brand<string, "Email">;

export async function validateEmail(body: tJObject) {
    const CODE = APIResCode.Error.BRAND.EMAIL;

    if (!("email" in body)) {
        // throw new APILoginFormEmailErrorResponse({ code: Code.NOT_PRESENT, message: "Email not present" });
        return xNoThrowFn.err(CODE.NOT_PRESENT);
    }

    const email = body.email;

    if (typeof email !== "string") {
        // throw new APILoginFormEmailErrorResponse({ code: Code.NOT_A_STRING, message: "Email must be a string" });
        return xNoThrowFn.err(CODE.NOT_A_STRING);
    }

    if (!email.match(/^[a-z0-9]+@/)) {
        /*
        throw new APILoginFormEmailErrorResponse({
            code: Code.USERNAME,
            message:
                "Email username must contain only letters and numbers (no dots, underscores, or special characters)",
        });
        */
        return xNoThrowFn.err(CODE.INVALID_USERNAME);
    }

    if (!email.match(/@[a-z0-9]+\./)) {
        /*
        throw new APILoginFormEmailErrorResponse({
            code: Code.INVALID_DOMAIN_NAME,
            message: "Email domain must contain only letters and numbers (no underscores or special characters)",
        });
        */
        return xNoThrowFn.err(CODE.INVALID_DOMAIN_NAME);
    }

    if (!email.match(/^[^.]*@[^.]*\.[^.]*$/)) {
        /*
        throw new APILoginFormEmailErrorResponse({
            code: Code.INVALID_EMAIL_CHARACTERS,
            message: "Email must not contain subdomains (format: username@domain.tld)",
        });
        */
        return xNoThrowFn.err(CODE.INVALID_EMAIL_CHARACTERS);
    }

    if (!email.match(/^[a-z0-9]+@[a-z0-9]+\.[a-z]{2,}$/)) {
        /*
        throw new APILoginFormEmailErrorResponse({
            code: Code.FAILED,
            message: "Invalid email address",
        });
        */
        return xNoThrowFn.err(CODE.FAILED);
    }

    return xNoThrowFn.ret(email as bEmail);
}
