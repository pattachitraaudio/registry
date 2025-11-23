import { SignJWT, jwtVerify } from "jose";
import { mUser } from "@/lib/db/models/mUser";
import { JOSEError } from "jose/errors";
import { xAPISessErrRes, xAPISessJWTErrRes } from "@/types/apiResponse/auth/session";
import { APIResCode } from "@/enums/APIResCode";
import { EnvType } from "./xEnvManager";
import { MongoClient, ObjectId } from "mongodb";

// type HexCharacter = "0" | "1" | "2" | "3" | "4" | "5" | "6" | "7" | "8" | "9" | "a" | "b" | "c" | "d" | "e" | "f" | "A" | "B" | "C" | "D" | "E" | "F";
// type HexString = `${HexCharacter}`
// type HexString<Length> = HexCharacter[Length]

interface SessionPayload {
    name: string;
    email: string;
    id: string;
    referredBy: string;
    referralCode: string;
    [key: string]: number | string;
}

export class CookieManager {
    public name = "jwt";
    private options: Record<string, string | number | boolean>;
    private secret: Uint8Array;
    private mongoDBClient!: MongoClient;

    constructor(jwtSecret: string, envType: EnvType) {
        this.secret = new TextEncoder().encode(jwtSecret);
        console.log("`Cookie Manager` env type:", envType);

        this.options = {
            HttpOnly: true,
            Secure: envType === "production",
            SameSite: "lax" as const,
            "Max-Age": 60 * 60 * 24 * 7, // 7 days
            Path: "/",
        };
    }

    async setup(mongoDBClient: MongoClient) {
        this.mongoDBClient = mongoDBClient;
        return this;
    }

    generatePayload(user: mUser): SessionPayload {
        return {
            name: user.name,
            email: user.email,
            id: user._id.toHexString(),
            referredBy: user.referredBy.toHexString(),
            referralCode: user.referralCode,
        };
    }

    async create(user: mUser): Promise<string> {
        const jwt = await new SignJWT(this.generatePayload(user))
            .setProtectedHeader({ alg: "HS256" })
            .setIssuedAt()
            .setExpirationTime("7d")
            .sign(this.secret);

        const cookieStr = [[this.name, jwt], ...Object.entries(this.options)]
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
    }

    async verify(cookie: string | null | undefined): Promise<SessionPayload> {
        const SessJWTErrCode = APIResCode.Error.Session.JWT;

        if (cookie == null) {
            throw new xAPISessJWTErrRes({ code: SessJWTErrCode.NOT_PRESENT, message: "Cookie (jwt) not present" });
        }

        try {
            const sessionPayload = (await jwtVerify<SessionPayload>(cookie, this.secret)).payload;

            const user = this.mongoDBClient
                .db("registry")
                .collection<mUser>("users")
                .findOne({ _id: ObjectId.createFromHexString(sessionPayload.id) });

            if (user == null) {
                throw new xAPISessErrRes(401, {
                    code: APIResCode.Error.Session.USER_NOT_FOUND,
                    message: "This is strange. the User has a valid cookie, but I can't find the user in the database",
                });
            }

            return sessionPayload;
        } catch (err) {
            // TODO: Implement proper error handling here
            if (err instanceof JOSEError) {
            }

            throw new xAPISessJWTErrRes({
                code: APIResCode.Error.Session.JWT.INVALID,
                message: "some error while jwt validation | Error reporting has not been properly implemented here",
            });
        }
    }
}
