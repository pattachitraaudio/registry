import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import clientPromise from "@/lib/mongodb";
import { User } from "@/models/User";
import { createSession, setSessionCookie } from "@/lib/session";

export async function POST(request: Request) {
    try {
        const { email, password } = await request.json();

        if (!email || !password) {
            return NextResponse.json(
                { error: "Missing required fields" },
                { status: 400 },
            );
        }

        const client = await clientPromise;
        const db = client.db();
        const usersCollection = db.collection<User>("users");

        const user = await usersCollection.findOne({ email });
        if (!user) {
            return NextResponse.json(
                { error: "Invalid credentials" },
                { status: 401 },
            );
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return NextResponse.json(
                { error: "Invalid credentials" },
                { status: 401 },
            );
        }

        // Check if email is verified
        if (!user.isVerified) {
            return NextResponse.json(
                {
                    error: "Please verify your email before logging in",
                    needsVerification: true,
                    email: user.email,
                },
                { status: 403 },
            );
        }

        // Create session token and set cookie
        const sessionPayload = {
            userId: user._id?.toString() || "",
            email: user.email,
            name: user.name,
        };

        const token = await createSession(sessionPayload);
        await setSessionCookie(token);

        return NextResponse.json(
            {
                message: "Login successful",
                user: {
                    _id: user._id?.toString(),
                    email: user.email,
                    name: user.name,
                },
            },
            { status: 200 },
        );
    } catch (error) {
        console.error("Login error:", error);
        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 },
        );
    }
}
