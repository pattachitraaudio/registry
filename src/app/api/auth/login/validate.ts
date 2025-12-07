import { bEmail, validateEmail } from "@/brands/email";
import { bPassword, validatePassword } from "@/brands/password";
import { APIResCode } from "@/enums/APIResCode";
import { Brand, tJObject } from "@/lib/util";
import { tNoThrowAsyncFn, xNoThrowFn } from "@/lib/xNoThrow";

// const validateEmail = async function (body: object) {
//     const Code = APIResCode.Error.Login.Form.Email;
//
//     if (!("email" in body)) {
//         // throw new APILoginFormEmailErrorResponse({ code: Code.NOT_PRESENT, message: "Email not present" });
//         return xNoThrowFn.err(Code.NOT_PRESENT);
//     }
//
//     const email = body.email;
//
//     if (typeof email !== "string") {
//         // throw new APILoginFormEmailErrorResponse({ code: Code.NOT_A_STRING, message: "Email must be a string" });
//         return xNoThrowFn.err(Code.NOT_A_STRING);
//     }
//
//     if (!email.match(/^[a-z0-9]+@/)) {
//         /*
//         throw new APILoginFormEmailErrorResponse({
//             code: Code.USERNAME,
//             message:
//                 "Email username must contain only letters and numbers (no dots, underscores, or special characters)",
//         });
//         */
//         return xNoThrowFn.err(Code.USERNAME);
//     }
//
//     if (!email.match(/@[a-z0-9]+\./)) {
//         /*
//         throw new APILoginFormEmailErrorResponse({
//             code: Code.INVALID_DOMAIN_NAME,
//             message: "Email domain must contain only letters and numbers (no underscores or special characters)",
//         });
//         */
//         return xNoThrowFn.err(Code.INVALID_DOMAIN_NAME);
//     }
//
//     if (!email.match(/^[^.]*@[^.]*\.[^.]*$/)) {
//         /*
//         throw new APILoginFormEmailErrorResponse({
//             code: Code.INVALID_EMAIL_CHARACTERS,
//             message: "Email must not contain subdomains (format: username@domain.tld)",
//         });
//         */
//         return xNoThrowFn.err(Code.INVALID_EMAIL_CHARACTERS);
//     }
//
//     if (!email.match(/^[a-z0-9]+@[a-z0-9]+\.[a-z]{2,}$/)) {
//         /*
//         throw new APILoginFormEmailErrorResponse({
//             code: Code.FAILED,
//             message: "Invalid email address",
//         });
//         */
//         return xNoThrowFn.err(Code.FAILED);
//     }
//
//     return xNoThrowFn.ret({ email });
// } satisfies tNoThrowAsyncFn;
//
// const validatePassword = async function (body: object) {
//     const Code = APIResCode.Error.Login.Form.Password;
//
//     if (!("password" in body)) {
//         /*
//         throw new APILoginFormPasswordErrorResponse({
//             code: Code.NOT_PRESENT,
//             message: "Password is required",
//         });
//         */
//         return xNoThrowFn.err(Code.NOT_PRESENT);
//     }
//
//     const password = body.password;
//
//     if (typeof password !== "string") {
//         /*
//         throw new APILoginFormPasswordErrorResponse({
//             code: Code.NOT_A_STRING,
//             message: "Password must be a string",
//         });
//         */
//         return xNoThrowFn.err(Code.NOT_A_STRING);
//     }
//
//     if (password.length < 8) {
//         /*
//         throw new APILoginFormPasswordErrorResponse({
//             code: Code.TOO_SHORT,
//             message: "Password must be at least 8 characters",
//         });
//         */
//         return xNoThrowFn.err(Code.TOO_SHORT);
//     }
//
//     if (password.length > 64) {
//         /*
//         throw new APILoginFormPasswordErrorResponse({
//             code: Code.TOO_LONG,
//             message: "Password must not exceed 64 characters",
//         });
//         */
//         return xNoThrowFn.err(Code.TOO_LONG);
//     }
//
//     if (!/[A-Z]/.test(password)) {
//         /*
//         throw new APILoginFormPasswordErrorResponse({
//             code: Code.MISSING_UPPERCASE,
//             message: "Password must contain at least one uppercase letter",
//         });
//         */
//         return xNoThrowFn.err(Code.MISSING_UPPERCASE);
//     }
//
//     if (!/[a-z]/.test(password)) {
//         /*
//         throw new APILoginFormPasswordErrorResponse({
//             code: Code.MISSING_LOWERCASE,
//             message: "Password must contain at least one lowercase letter",
//         });
//         */
//         return xNoThrowFn.err(Code.MISSING_LOWERCASE);
//     }
//
//     if (!/[0-9]/.test(password)) {
//         /*
//         throw new APILoginFormPasswordErrorResponse({
//             code: Code.MISSING_NUMBER,
//             message: "Password must contain at least one number",
//         });
//         */
//         return xNoThrowFn.err(Code.MISSING_NUMBER);
//     }
//
//     if (!/[^A-Za-z0-9]/.test(password)) {
//         /*
//         throw new APILoginFormPasswordErrorResponse({
//             code: Code.MISSING_SPECIAL_CHARACTER,
//             message: "Password must contain at least one special character",
//         });
//         */
//         return xNoThrowFn.err(Code.MISSING_SPECIAL_CHARACTER);
//     }
//
//     return xNoThrowFn.ret({ password });
// } satisfies tNoThrowAsyncFn;

export type bLoginReq = Brand<
    {
        email: bEmail;
        password: bPassword;
    },
    "Login"
>;

export const validateLoginReqBodyJSON = async function (body: tJObject) {
    const emailValidated = await validateEmail(body);

    if (emailValidated.err != null) {
        return emailValidated;
    }

    const passwordValidated = await validatePassword(body);

    if (passwordValidated.err != null) {
        return passwordValidated;
    }

    return xNoThrowFn.ret({
        email: emailValidated.ret,
        password: passwordValidated.ret,
    } as bLoginReq);
} satisfies tNoThrowAsyncFn;
