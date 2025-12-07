import { APIResCode } from "@/enums/APIResCode";
import { Brand, tJObject } from "@/lib/util";
import { xNoThrowFn } from "@/lib/xNoThrow";

export type bName = Brand<string, "Name">;

export async function validateName(body: tJObject) {
    const CODE = APIResCode.Error.SignUp.Form.Name;
    if (!("name" in body)) {
        /*
        throw new APISignUpFormNameErrorResponse({ code: Code.NOT_PRESENT, message: "Name is required" });
        */
        return xNoThrowFn.err(CODE.NOT_PRESENT);
    }

    const name = body.name;

    console.log("name:", name);

    if (typeof name !== "string") {
        /*
        throw new APISignUpFormNameErrorResponse({ code: Code.NOT_A_STRING, message: "Name must be a string" });
        */
        return xNoThrowFn.err(CODE.NOT_A_STRING);
    }

    const trimmedName = name.trim();

    if (trimmedName.length < 2) {
        /*
        throw new APISignUpFormNameErrorResponse({
            code: Code.TOO_SHORT,
            message: "Name must be at least 2 characters",
        });
        */
        return xNoThrowFn.err(CODE.TOO_SHORT);
    }

    if (trimmedName.length > 50) {
        /*
        throw new APISignUpFormNameErrorResponse({
            code: Code.TOO_LONG,
            message: "Name must not exceed 50 characters",
        });
        */
        return xNoThrowFn.err(CODE.TOO_LONG);
    }

    return xNoThrowFn.ret(name as bName);
}
