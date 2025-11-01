import { NextResponse } from "next/server";

function validateToken(bodyObj: object): { vfToken: string } {
    const Code = APIResponseCode.Error.VerifyEmail.VfToken;

    if (!("vfToken" in bodyObj)) {
        throw new {
            code: Code.NOT_PRESENT,
            message: "Verification token is required",
        }();
    }

    if (typeof bodyObj["vfToken"] !== "string") {
        throw new APIVerifyEmailVfTokenErrorResponse({
            code: Code.NOT_A_STRING,
            message: "Verification token must be of type string",
        });
    }

    const vfToken = bodyObj["vfToken"];

    if (vfToken.length !== 24) {
        throw new APIVerifyEmailVfTokenErrorResponse({
            code: Code.INVALID_LENGTH,
            message: "Verification token must be exactly 24 characters long",
        });
    }

    if (!/^[0-9a-fA-F]+$/.test(vfToken)) {
        throw new APIVerifyEmailVfTokenErrorResponse({
            code: Code.NON_HEX_CHARACTER,
            message: "Verification token must contain only hexadecimal characters",
        });
    }

    return { vfToken };
}

export async function POST() {
    try {
        return NextResponse.json({ message: "Logged out successfully" }, { status: 200 });
    } catch (error) {
        console.error("Logout error:", error);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}
