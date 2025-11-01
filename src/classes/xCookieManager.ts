import { SignJWT, jwtVerify } from "jose";
import { MUser } from "@/models/mUser";
import { JOSEError } from "jose/errors";
import { APISessionJWTErrorResponse } from "@/classes/apiResponses/session";
import { APIResponseCode } from "@/enums/APIResponseCode";
import { EnvType } from "./xEnvManager";

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

    generatePayload(user: MUser): SessionPayload {
        return {
            name: user.name,
            email: user.email,
            id: user._id.toHexString(),
            referredBy: user.referredBy.toHexString(),
            referralCode: user.referralCode,
        };
    }

    async create(user: MUser): Promise<string> {
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

    async verify(cookie: string): Promise<SessionPayload> {
        try {
            return (await jwtVerify<SessionPayload>(cookie, this.secret)).payload;
        } catch (err) {
            // TODO: Implement proper error handling here
            if (err instanceof JOSEError) {
            }

            throw new APISessionJWTErrorResponse(401, {
                code: APIResponseCode.Error.Session.JWT.INVALID,
                message: "some error while jwt validation | Error reporting has not been properly implemented here",
            });
        }
    }
}
