import { SignJWT, jwtVerify } from "jose";
import { APIResCode } from "@/enums/APIResCode";
import { ObjectId } from "mongodb";
import { envPromise } from "../env";
import { mUser, mUserPromise } from "@/repo/mUser";
import { xNoThrowFn } from "../xNoThrow";

// type HexCharacter = "0" | "1" | "2" | "3" | "4" | "5" | "6" | "7" | "8" | "9" | "a" | "b" | "c" | "d" | "e" | "f" | "A" | "B" | "C" | "D" | "E" | "F";
// type HexString = `${HexCharacter}`
// type HexString<Length> = HexCharacter[Length]

export interface iSessionPayload {
    name: string;
    email: string;
    id: string;
    referredBy: string;
    referralCode: string;
    [key: string]: number | string;
}

export const COOKIE_NAME = {
    SESSION: "jwt",
};

const verifyJWT = async function (jwt: string, key: Uint8Array) {
    try {
        const sessionPayload = await jwtVerify<iSessionPayload>(jwt, key);
        return xNoThrowFn.ret(sessionPayload.payload);
    } catch {
        return xNoThrowFn.err({ msg: "Err while verifying jwt" });
    }
};

export const sessionPromise = (async function () {
    const env = (await envPromise).ret;
    const secret = new TextEncoder().encode(env.JWT_SECRET);
    // const dbClient = await dbClientPromise;
    const CODE = APIResCode.Error.Session;

    console.log("`Cookie Manager` env type:", env.ENV_TYPE);

    const options = {
        HttpOnly: true,
        Secure: env.ENV_TYPE !== "development",
        SameSite: "lax" as const,
        "Max-Age": 60 * 60 * 24 * 7, // 7 days
        Path: "/",
    };

    function generatePayloadForUser(user: mUser): iSessionPayload {
        return {
            name: user.name,
            email: user.email,
            id: user._id.toHexString(),
            referredBy: user.referredBy.toHexString(),
            referralCode: user.referralCode,
        };
    }

    return xNoThrowFn.ret({
        async create(user: mUser): Promise<string> {
            const jwt = await new SignJWT(generatePayloadForUser(user))
                .setProtectedHeader({ alg: "HS256" })
                .setIssuedAt()
                .setExpirationTime("7d")
                .sign(secret);

            const cookieStr = [[COOKIE_NAME.SESSION, jwt], ...Object.entries(options)]
                .map(([k, v]) => {
                    if (typeof v === "boolean") {
                        if (!v) {
                            return;
                        }

                        return k;
                    }

                    return `${k}=${v}`;
                })
                .filter((val) => val != null)
                .join("; ");

            return cookieStr;
        },

        async verify(cookie: string | null | undefined) {
            // const SessJWTErrCode = APIResCode.Error.Session.JWT;

            if (cookie == null) {
                // throw new xAPISessJWTErrRes({ code: SessJWTErrCode.NOT_PRESENT, message: "Cookie (jwt) not present" });
                return xNoThrowFn.err(CODE.JWT.NOT_PRESENT);
            }

            // try {
            const jwtVerifyResult = await verifyJWT(cookie, secret);

            if (jwtVerifyResult.err != null) {
                return jwtVerifyResult;
            }

            const sessionPayload = jwtVerifyResult.ret;

            /*
                const user = dbClient
                    .db("registry")
                    .collection<mUser>("users")
                    .findOne({ _id: ObjectId.createFromHexString(sessionPayload.id) });
                    */

            const mUserResult = await mUserPromise;

            if (mUserResult.err != null) {
                return mUserResult.err;
            }

            const mUser = mUserResult.ret;

            const userResult = await mUser.findOne({ _id: ObjectId.createFromHexString(sessionPayload.id) });

            if (userResult.err != null) {
                return xNoThrowFn.err({ msg: "Database err while trying to find user " });
            }

            const user = userResult.ret;

            if (user == null) {
                /*
                    throw new xAPISessErrRes(401, {
                        code: APIResCode.Error.Session.USER_NOT_FOUND,
                        message:
                            "This is strange. the User has a valid cookie, but I can't find the user in the database",
                    });
                    */
                return xNoThrowFn.err({
                    msg: "User not found in db",
                });
            }

            if (user.accountSuspended) {
                return xNoThrowFn.err({
                    msg: "This account has been suspended",
                });
            }

            return xNoThrowFn.ret(sessionPayload);
            /*
            } catch (err) {
                // TODO: Implement proper error handling here
                if (err instanceof JOSEError) {
                }

                throw new xAPISessJWTErrRes({
                    code: APIResCode.Error.Session.JWT.INVALID,
                    message: "some error while jwt validation | Error reporting has not been properly implemented here",
                });
            }
                */
        },
    });
})();
