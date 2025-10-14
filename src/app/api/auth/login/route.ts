import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { createSession, setSessionCookie } from "@/lib/session";
import { ErrorResponse } from "@/interfaces/APIResponses/ErrorResponse";
import { APIResponseCode } from "@/app/enums/APIResponseCode";
import { Globals } from "@/config/globals";
import { UserResponse } from "@/interfaces/APIResponses/UserResponse";

export async function POST(request: Request): Promise<NextResponse<ErrorResponse> | NextResponse<UserResponse>> {
    try {
        // TODO: Use zod for schema vaildation
        const { email, password } = await request.json();

        if (!email || !password) {
            return NextResponse.json(
                { status: APIResponseCode.GENERIC_ERROR, message: "Missing required fields" },
                { status: 400 },
            );
        }

        /*
        const client = await clientPromise;
        const db = client.db();
        const usersCollection = db.collection<MUser>("users");

        const user = await usersCollection.findOne({ email });
        */

        const users = Globals.mongoDB.users();
        const user = await users.findOne({ email: email });

        if (!user) {
            return NextResponse.json(
                { status: APIResponseCode.GENERIC_ERROR, message: "User not found" },
                { status: 401 },
            );
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);

        if (!isPasswordValid) {
            return NextResponse.json(
                { status: APIResponseCode.GENERIC_ERROR, message: "Incorrect password" },
                { status: 401 },
            );
        }

        // Check if email is verified
        if (!user.isVerified) {
            return NextResponse.json(
                {
                    status: APIResponseCode.GENERIC_ERROR,
                    message: "Email not verified",
                },
                { status: 403 },
            );
        }

        // Create session token and set cookie

        const session = await createSession({ id: user._id.toHexString() });
        await setSessionCookie(session);

        return NextResponse.json(
            {
                status: APIResponseCode.SUCCESS,
                message: "Login successful",
                data: {
                    id: user._id.toString(),
                    email: user.email,
                    name: user.name,
                },
            },
            { status: 200 },
        );
    } catch (error) {
        console.error("Login error:", error);
        return NextResponse.json(
            { status: APIResponseCode.GENERIC_ERROR, message: "Internal server error" },
            { status: 500 },
        );
    }
}
