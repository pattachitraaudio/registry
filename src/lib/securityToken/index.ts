import crypto from "node:crypto";
import { xNoThrowFn } from "../xNoThrow";
import { Binary } from "mongodb";

import { SECURITY_TOKEN_LEN_BYTES } from "./constant";

const generateToken = async function (numBytes: number) {
    return xNoThrowFn.ret(new Binary(crypto.randomBytes(numBytes)));
};

const tokenGeneratorFactory = function (numBytes: number) {
    return function () {
        return generateToken(numBytes);
    };
};

export const securityTokenPromise = (async function () {
    return xNoThrowFn.ret({
        emailVerificationToken: tokenGeneratorFactory(SECURITY_TOKEN_LEN_BYTES.EMAIL_VERIFICATION),
    });
})();
