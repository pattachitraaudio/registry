import { COOKIE_NAME, iSessionPayload, sessionPromise } from "./session";
import { xNoThrowFn } from "./xNoThrow";

export const validateSession = async function (req: Request) {
    const headers = req.headers;
    const cookieHeader = headers.get("cookie");

    if (cookieHeader == null) {
        return xNoThrowFn.err({
            msg: "header 'cookie' not found",
        });
    }

    const cookiesString = cookieHeader.split(";");

    // TODO: validate cookies properly
    const cookiesKV = cookiesString.map((cookieString) => {
        const kv = cookieString.split("=");

        if (kv.length !== 2) {
            console.error("invalid cookie string: " + cookieString);
        }

        const key = kv[0];
        const val = kv[1];

        return { key, val };
    });

    const cookies = new Map<string, string>();

    cookiesKV.forEach(({ key, val }) => {
        cookies.set(key, val);
    });

    const jwt = cookies.get(COOKIE_NAME.SESSION);

    if (jwt == null) {
        xNoThrowFn.err({
            msg: `cookie with key '${COOKIE_NAME.SESSION}' not found`,
        });
    }

    const sessionService = (await sessionPromise).ret;

    const sessionResult = await sessionService.verify(jwt);

    if (sessionResult.err != null) {
        // return sessionResult;
        return xNoThrowFn.err({
            msg: "failed to verify session cookie",
        });
    }

    const sessionPayload = sessionResult.ret;

    return xNoThrowFn.ret({
        id: sessionPayload.id,
        name: sessionPayload.name,
        email: sessionPayload.email,
        referredBy: sessionPayload.referredBy,
        referralCode: sessionPayload.referralCode,
    } satisfies iSessionPayload);
};
