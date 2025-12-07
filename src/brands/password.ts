import { APIResCode } from "@/enums/APIResCode";
import { Brand } from "@/lib/util";
import { xNoThrowFn } from "@/lib/xNoThrow";

export type bPassword = Brand<string, "Password">;

export async function validatePassword(body: object) {
    const CODE = APIResCode.Error.BRAND.PASSWORD;

    if (!("password" in body)) {
        /*
        throw new APILoginFormPasswordErrorResponse({
            code: Code.NOT_PRESENT,
            message: "Password is required",
        });
        */
        return xNoThrowFn.err(CODE.NOT_PRESENT);
    }

    const password = body.password;

    if (typeof password !== "string") {
        /*
        throw new APILoginFormPasswordErrorResponse({
            code: Code.NOT_A_STRING,
            message: "Password must be a string",
        });
        */
        return xNoThrowFn.err(CODE.NOT_A_STRING);
    }

    if (password.length < 8) {
        /*
        throw new APILoginFormPasswordErrorResponse({
            code: Code.TOO_SHORT,
            message: "Password must be at least 8 characters",
        });
        */
        return xNoThrowFn.err(CODE.TOO_SHORT);
    }

    if (password.length > 64) {
        /*
        throw new APILoginFormPasswordErrorResponse({
            code: Code.TOO_LONG,
            message: "Password must not exceed 64 characters",
        });
        */
        return xNoThrowFn.err(CODE.TOO_LONG);
    }

    if (!/[A-Z]/.test(password)) {
        /*
        throw new APILoginFormPasswordErrorResponse({
            code: Code.MISSING_UPPERCASE,
            message: "Password must contain at least one uppercase letter",
        });
        */
        return xNoThrowFn.err(CODE.MISSING_UPPERCASE);
    }

    if (!/[a-z]/.test(password)) {
        /*
        throw new APILoginFormPasswordErrorResponse({
            code: Code.MISSING_LOWERCASE,
            message: "Password must contain at least one lowercase letter",
        });
        */
        return xNoThrowFn.err(CODE.MISSING_LOWERCASE);
    }

    if (!/[0-9]/.test(password)) {
        /*
        throw new APILoginFormPasswordErrorResponse({
            code: Code.MISSING_NUMBER,
            message: "Password must contain at least one number",
        });
        */
        return xNoThrowFn.err(CODE.MISSING_NUMBER);
    }

    if (!/[^A-Za-z0-9]/.test(password)) {
        /*
        throw new APILoginFormPasswordErrorResponse({
            code: Code.MISSING_SPECIAL_CHARACTER,
            message: "Password must contain at least one special character",
        });
        */
        return xNoThrowFn.err(CODE.MISSING_SPECIAL_CHARACTER);
    }

    return xNoThrowFn.ret(password as bPassword);
}
