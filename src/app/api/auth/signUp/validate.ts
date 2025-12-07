import { bCaptcha, validateCaptcha } from "@/brands/captcha";
import { bEmail, validateEmail } from "@/brands/email";
import { bName, validateName } from "@/brands/name";
import { bPassword, validatePassword } from "@/brands/password";
import { bReferralCode, validateReferralCode } from "@/brands/referralCode";
import { APIResCode } from "@/enums/APIResCode";
import { Brand, tJObject } from "@/lib/util";
import { tNoThrowAsyncFn, xNoThrowFn } from "@/lib/xNoThrow";

// const validateCaptcha = async function (body: object) {
// const Code = APIResCode.Error.SignUp.Captcha;
//
// if (!("captchaRes" in body)) {
// /*
// throw new APISignUpErrorResponse(400, {
// code: Code.CAPTCHA_NOT_PRESENT,
// message: "Captcha response not present",
// });
// */
// return xNoThrowFn.err(Code.CAPTCHA_NOT_PRESENT);
// }
//
// if (typeof body["captchaRes"] !== "string") {
// /*
// throw new APISignUpErrorResponse(400, {
// code: Code.CAPTCHA_NOT_A_STRING,
// message: "Captcha res must be a string",
// });
// */
// return xNoThrowFn.err(Code.CAPTCHA_NOT_A_STRING);
// }
//
// return xNoThrowFn.ret({ captchaRes: body["captchaRes"] });
// } satisfies tNoThrowAsyncFn;
//
// const validateEmail = async function (body: object) {
// const Code = APIResCode.Error.SignUp.Form.Email;
//
// if (!("email" in body)) {
// /*
// throw new APISignUpFormEmailErrorResponse({
// code: Code.NOT_PRESENT,
// message: "Email not present",
// });
// */
// return xNoThrowFn.err(Code.NOT_PRESENT);
// }
//
// const email = body.email;
//
// if (typeof email !== "string") {
// /*
// throw new APISignUpFormEmailErrorResponse({ code: Code.NOT_A_STRING, message: "Email must be a string" });
// */
// return xNoThrowFn.err(Code.NOT_A_STRING);
// }
//
// if (!email.match(/^[a-z0-9]+@/)) {
// /*
// throw new APISignUpFormEmailErrorResponse({
// code: Code.INVALID_USERNAME,
// message:
// "Email username must contain only letters and numbers (no dots, underscores, or special characters)",
// });
// */
// return xNoThrowFn.err(Code.INVALID_USERNAME);
// }
//
// if (!email.match(/@[a-z0-9]+\./)) {
// /*
// throw new APISignUpFormEmailErrorResponse({
// code: Code.INVALID_DOMAIN_NAME,
// message: "Email domain must contain only letters and numbers (no underscores or special characters)",
// });
// */
// return xNoThrowFn.err(Code.INVALID_DOMAIN_NAME);
// }
//
// if (!email.match(/^[^.]*@[^.]*\.[^.]*$/)) {
// /*
// throw new APISignUpFormEmailErrorResponse({
// code: Code.INVALID_DOMAIN_NAME,
// message: "Email must not contain subdomains (format: username@domain.tld)",
// });
// */
// return xNoThrowFn.err(Code.INVALID_EMAIL_CHARACTERS);
// }
//
// if (!email.match(/^[a-z0-9]+@[a-z0-9]+\.[a-z]{2,}$/)) {
// /*
// throw new APISignUpFormEmailErrorResponse({
// code: Code.FAILED,
// message: "Invalid email address",
// });
// */
// return xNoThrowFn.err(Code.FAILED);
// }
//
// return xNoThrowFn.ret({ email });
// } satisfies tNoThrowAsyncFn;
//
// const validateName = async function (body: object) {
// const Code = APIResCode.Error.SignUp.Form.Name;
// if (!("name" in body)) {
// /*
// throw new APISignUpFormNameErrorResponse({ code: Code.NOT_PRESENT, message: "Name is required" });
// */
// return xNoThrowFn.err(Code.NOT_PRESENT);
// }
//
// const name = body.name;
//
// console.log("name:", name);
//
// if (typeof name !== "string") {
// /*
// throw new APISignUpFormNameErrorResponse({ code: Code.NOT_A_STRING, message: "Name must be a string" });
// */
// return xNoThrowFn.err(Code.NOT_A_STRING);
// }
//
// const trimmedName = name.trim();
//
// if (trimmedName.length < 2) {
// /*
// throw new APISignUpFormNameErrorResponse({
// code: Code.TOO_SHORT,
// message: "Name must be at least 2 characters",
// });
// */
// return xNoThrowFn.err(Code.TOO_SHORT);
// }
//
// if (trimmedName.length > 50) {
// /*
// throw new APISignUpFormNameErrorResponse({
// code: Code.TOO_LONG,
// message: "Name must not exceed 50 characters",
// });
// */
// return xNoThrowFn.err(Code.TOO_LONG);
// }
//
// return xNoThrowFn.ret({ name });
// } satisfies tNoThrowAsyncFn;
//
// const validatePassword = async function (body: object) {
// const Code = APIResCode.Error.SignUp.Form.Password;
//
// if (!("password" in body)) {
// /*
// throw new APISignUpFormPasswordErrorResponse({
// code: Code.NOT_PRESENT,
// message: "Password is required",
// });
// */
// return xNoThrowFn.err(Code.NOT_PRESENT);
// }
//
// const password = body.password;
//
// if (typeof password !== "string") {
// /*
// throw new APISignUpFormPasswordErrorResponse({
// code: Code.NOT_A_STRING,
// message: "Password must be a string",
// });
// */
// return xNoThrowFn.err(Code.NOT_A_STRING);
// }
//
// if (password.length < 8) {
// /*
// throw new APISignUpFormPasswordErrorResponse({
// code: Code.TOO_SHORT,
// message: "Password must be at least 8 characters",
// });
// */
// return xNoThrowFn.err(Code.TOO_SHORT);
// }
//
// if (password.length > 64) {
// /*
// throw new APISignUpFormPasswordErrorResponse({
// code: Code.TOO_LONG,
// message: "Password must not exceed 64 characters",
// });
// */
// return xNoThrowFn.err(Code.TOO_LONG);
// }
//
// if (!/[A-Z]/.test(password)) {
// /*
// throw new APISignUpFormPasswordErrorResponse({
// code: Code.MISSING_UPPERCASE,
// message: "Password must contain at least one uppercase letter",
// });
// */
// return xNoThrowFn.err(Code.MISSING_UPPERCASE);
// }
//
// if (!/[a-z]/.test(password)) {
// /*
// throw new APISignUpFormPasswordErrorResponse({
// code: Code.MISSING_LOWERCASE,
// message: "Password must contain at least one lowercase letter",
// });
// */
// return xNoThrowFn.err(Code.MISSING_LOWERCASE);
// }
//
// if (!/[0-9]/.test(password)) {
// /*
// throw new APISignUpFormPasswordErrorResponse({
// code: Code.MISSING_NUMBER,
// message: "Password must contain at least one number",
// });
// */
// return xNoThrowFn.err(Code.MISSING_NUMBER);
// }
//
// if (!/[^A-Za-z0-9]/.test(password)) {
// /*
// throw new APISignUpFormPasswordErrorResponse({
// code: Code.MISSING_SPECIAL_CHARACTER,
// message: "Password must contain at least one special character",
// });
// */
// return xNoThrowFn.err(Code.MISSING_SPECIAL_CHARACTER);
// }
//
// return xNoThrowFn.ret({ password });
// } satisfies tNoThrowAsyncFn;
//
// const validateReferralCode = async function (body: object) {
// const Code = APIResCode.Error.SignUp.Form.ReferralCode;
//
// if (!("referralCode" in body)) {
// /*
// throw new APISignUpFormReferralCodeErrorResponse({
// code: Code.PRESENT,
// message: "Referral code is required to signUp",
// });
// */
// return xNoThrowFn.err(Code.PRESENT);
// }
//
// if (typeof body["referralCode"] !== "string") {
// /*
// throw new APISignUpFormReferralCodeErrorResponse({
// code: Code.A_STRING,
// message: "Referral code must be a string",
// });
// */
// return xNoThrowFn.err(Code.A_STRING);
// }
//
// const referralCode = body.referralCode.toUpperCase();
//
// if (referralCode.length !== 15 && referralCode.length !== 35) {
// /*
// throw new APISignUpFormReferralCodeErrorResponse({
// code: Code.INVALID_REFERRAL_CODE_LENGTH,
// message: "Referral code must be exactly 15 characters",
// });
// */
// console.log(referralCode, referralCode.length);
// return xNoThrowFn.err(Code.INVALID_REFERRAL_CODE_LENGTH);
// }
//
// if (!referralCode.startsWith("REF")) {
// /*
// throw new APISignUpFormReferralCodeErrorResponse({
// code: Code.START_WITH_REF,
// message: "Referral code must start with `REF`",
// });
// */
// return xNoThrowFn.err(Code.START_WITH_REF);
// }
//
// return xNoThrowFn.ret({ referralCode });
// } satisfies tNoThrowAsyncFn;

export type bSignUpReqBodyJSON = Brand<
    {
        name: bName;
        email: bEmail;
        password: bPassword;
        referralCode: bReferralCode;
        captchaRes: bCaptcha;
    },
    "SignUp"
>;

export const validateSignUpReqBodyJSON = async function (body: tJObject) {
    const nameValidated = await validateName(body);

    if (nameValidated.err != null) {
        return nameValidated;
    }

    const emailValidated = await validateEmail(body);

    if (emailValidated.err != null) {
        return emailValidated;
    }

    const passwordValidated = await validatePassword(body);

    if (passwordValidated.err != null) {
        return passwordValidated;
    }

    const referralCodeValidated = await validateReferralCode(body);

    if (referralCodeValidated.err != null) {
        return referralCodeValidated;
    }

    const captchaValidated = await validateCaptcha(body);

    if (captchaValidated.err != null) {
        return captchaValidated;
    }

    return xNoThrowFn.ret({
        name: nameValidated.ret,
        email: emailValidated.ret,
        password: passwordValidated.ret,
        referralCode: referralCodeValidated.ret,
        captchaRes: captchaValidated.ret,
    } as bSignUpReqBodyJSON);
} satisfies tNoThrowAsyncFn;
