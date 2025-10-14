import { SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";
import { SessionPayload } from "@/interfaces/SessionPayload";

const secret = new TextEncoder().encode(process.env.JWT_SECRET || "Pattachitra@keymaster299");

const COOKIE_NAME = "jwt";

const COOKIE_OPTIONS = {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax" as const,
    maxAge: 60 * 60 * 24 * 7, // 7 days
    path: "/",
};

export async function createSession(payload: SessionPayload): Promise<string> {
    const token = await new SignJWT(payload)
        .setProtectedHeader({ alg: "HS256" })
        .setIssuedAt()
        .setExpirationTime("7d")
        .sign(secret);

    return token;
}

export async function verifySession(token: string): Promise<SessionPayload> {
    return (await jwtVerify<SessionPayload>(token, secret)).payload;
}

export async function setSessionCookie(token: string): Promise<void> {
    (await cookies()).set(COOKIE_NAME, token, COOKIE_OPTIONS);
}

export async function getSessionCookie(): Promise<string | undefined> {
    return (await cookies()).get(COOKIE_NAME)?.value;
}

export async function deleteSessionCookie(): Promise<void> {
    (await cookies()).delete(COOKIE_NAME);
}

export async function getSession() {
    const payload = await getSessionCookie();
    if (!payload) {
        throw new Error();
    }
    return await verifySession(payload);
}
