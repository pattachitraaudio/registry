import { bEmail, validateEmail } from "@/brands/email";
import { Brand, tJObject } from "@/lib/util";
import { xNoThrowFn } from "@/lib/xNoThrow";

export type bResendVfEmailReqBodyJSON = Brand<
    {
        email: bEmail;
    },
    "ResendVfEmail"
>;

export const validateResendVfEmailReqBodyJSON = async function (body: tJObject) {
    const validatedEmailResult = await validateEmail(body);

    if (validatedEmailResult.err != null) {
        return validatedEmailResult;
    }

    return xNoThrowFn.ret({ email: validatedEmailResult.ret } as bResendVfEmailReqBodyJSON);
};
