import { APIResCode } from "@/enums/APIResCode";
import { Brand, tJObject } from "@/lib/util";
import { tNoThrowAsyncFn, xNoThrowFn } from "@/lib/xNoThrow";

const validateAPIKey = async function (bodyObj: object) {
    const Code = APIResCode.Error.Account.ElevenLabs.Add.Form.APIKey;
    // example: sk_6f2faec1f02da9c79121ac5f1554cba22719ca158f32b292

    if (!("apiKey" in bodyObj)) {
        return xNoThrowFn.err(Code.NOT_PRESENT);
    }

    const apiKey = bodyObj.apiKey;

    if (typeof apiKey !== "string") {
        return xNoThrowFn.err(Code.NOT_A_STRING);
    }

    if (!apiKey.startsWith("sk_")) {
        return xNoThrowFn.err(Code.INVALID_PREFIX);
    }

    if (apiKey.length !== 51) {
        // sk_ (3 chars) + 48 hex chars = 51 total
        return xNoThrowFn.err(Code.INVALID_LENGTH);
    }

    const hexPart = apiKey.slice(3); // Get everything after "sk_"
    if (!hexPart.match(/^[a-f0-9]{48}$/)) {
        return xNoThrowFn.err(Code.INVALID_FORMAT);
    }

    return xNoThrowFn.ret({ apiKey });
} satisfies tNoThrowAsyncFn;

const validateEmail = async function (bodyObj: object) {
    const Code = APIResCode.Error.Account.ElevenLabs.Add.Form.Email;

    if (!("email" in bodyObj)) {
        return xNoThrowFn.err(Code.NOT_PRESENT);
    }

    const email = bodyObj.email;

    if (typeof email !== "string") {
        return xNoThrowFn.err(Code.NOT_A_STRING);
    }

    if (!email.match(/^[a-z0-9]+@/)) {
        return xNoThrowFn.err(Code.INVALID_USERNAME);
    }

    if (!email.match(/@[a-z0-9]+\./)) {
        return xNoThrowFn.err(Code.INVALID_DOMAIN_NAME);
    }

    if (!email.match(/^[^.]*@[^.]*\.[^.]*$/)) {
        return xNoThrowFn.err(Code.INVALID_EMAIL_CHARACTERS);
    }

    if (!email.match(/^[a-z0-9]+@[a-z0-9]+\.[a-z]{2,}$/)) {
        return xNoThrowFn.err(Code.FAILED_TO_VALIDATE_EMAIL);
    }

    return xNoThrowFn.ret({ email });
} satisfies tNoThrowAsyncFn;

const validatePassword = async function (body: object) {
    const Code = APIResCode.Error.Account.ElevenLabs.Add.Form.Password;

    if (!("password" in body)) {
        return xNoThrowFn.err(Code.NOT_PRESENT);
    }

    const password = body.password;

    if (typeof password !== "string") {
        return xNoThrowFn.err(Code.NOT_A_STRING);
    }

    if (password.length < 8) {
        return xNoThrowFn.err(Code.TOO_SHORT);
    }

    if (password.length > 128) {
        return xNoThrowFn.err(Code.TOO_LONG);
    }

    if (!password.match(/[a-z]/)) {
        return xNoThrowFn.err(Code.MISSING_LOWERCASE);
    }

    if (!password.match(/[A-Z]/)) {
        return xNoThrowFn.err(Code.MISSING_UPPERCASE);
    }

    if (!password.match(/[0-9]/)) {
        return xNoThrowFn.err(Code.MISSING_NUMBER);
    }

    if (!password.match(/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/)) {
        return xNoThrowFn.err(Code.MISSING_SPECIAL_CHARACTER);
    }

    return xNoThrowFn.ret({ password });
} satisfies tNoThrowAsyncFn;

export type bPoolElevenLabsAddReq = Brand<
    {
        apiKey: string;
        email: string;
        password: string;
    },
    "PoolElevenLabsAdd"
>;

export const validatePoolElevenLabsAddReqBodyJSON = async function (body: tJObject) {
    const apiKeyValidated = await validateAPIKey(body);

    if (apiKeyValidated.err != null) {
        return apiKeyValidated;
    }

    const emailValidated = await validateEmail(body);

    if (emailValidated.err != null) {
        return emailValidated;
    }

    const passwordValidated = await validatePassword(body);

    if (passwordValidated.err != null) {
        return passwordValidated;
    }

    return xNoThrowFn.ret({
        apiKey: apiKeyValidated.ret.apiKey,
        email: emailValidated.ret.email,
        password: passwordValidated.ret.password,
    } as bPoolElevenLabsAddReq);
} satisfies tNoThrowAsyncFn;
