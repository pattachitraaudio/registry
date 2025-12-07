import { APIResCode } from "@/enums/APIResCode";
import { SECURITY_TOKEN_LEN_BYTES } from "@/lib/securityToken/constant";
import { Brand, tJObject } from "@/lib/util";
import { xNoThrowFn } from "@/lib/xNoThrow";

export type bVerifyEmailReq = Brand<
    {
        vfToken: string;
    },
    "VerifyEmail"
>;

export const validateVerifyEmailReqBodyJSON = async function (body: tJObject) {
    const Code = APIResCode.Error.VerifyEmail.VfToken;

    if (!("vfToken" in body)) {
        /*
        throw new APIVerifyEmailVfTokenErrorResponse({
            code: Code.NOT_PRESENT,
            message: "Verification token is required",
        });
        */
        return xNoThrowFn.err(Code.NOT_PRESENT);
    }

    if (typeof body["vfToken"] !== "string") {
        /*
        throw new APIVerifyEmailVfTokenErrorResponse({
            code: Code.NOT_A_STRING,
            message: "Verification token must be of type string",
        });
        */

        return xNoThrowFn.err(Code.NOT_A_STRING);
    }

    const vfToken = body["vfToken"];

    if (vfToken.length !== 2 * SECURITY_TOKEN_LEN_BYTES.EMAIL_VERIFICATION) {
        /*
        throw new APIVerifyEmailVfTokenErrorResponse({
            code: Code.INVALID_LENGTH,
            message: "Verification token must be exactly 24 characters long",
        });
        */
        return xNoThrowFn.err(Code.INVALID_LENGTH);
    }

    if (!/^[0-9a-fA-F]+$/.test(vfToken)) {
        /*
        throw new APIVerifyEmailVfTokenErrorResponse({
            code: Code.NON_HEX_CHARACTER,
            message: "Verification token must contain only hexadecimal characters",
        });
        */
        return xNoThrowFn.err(Code.NON_HEX_CHARACTER);
    }

    return xNoThrowFn.ret({ vfToken } as bVerifyEmailReq);
};
