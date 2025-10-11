import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import crypto from "crypto";
import clientPromise from "@/lib/mongodb";
import { User } from "@/models/User";
import { sendVerificationEmail } from "@/lib/email";

export async function POST(request: Request) {
    try {
        const { email, password, name } = await request.json();

        if (!email || !password || !name) {
            return NextResponse.json(
                { error: "Missing required fields" },
                { status: 400 },
            );
        }

        const client = await clientPromise;
        const db = client.db();
        const usersCollection = db.collection<User>("users");

        const existingUser = await usersCollection.findOne({ email });
        if (existingUser) {
            return NextResponse.json(
                { error: "User already exists" },
                { status: 409 },
            );
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        // Generate verification token
        const verificationToken = crypto.randomBytes(32).toString("hex");
        const verificationTokenExpiry = new Date(
            Date.now() + 24 * 60 * 60 * 1000,
        ); // 24 hours

        const newUser: User = {
            email,
            password: hashedPassword,
            name,
            isVerified: false,
            verificationToken,
            verificationTokenExpiry,
            accountsRedeemed: 0,
            createdAt: new Date(),
        };

        const result = await usersCollection.insertOne(newUser);

        // Send verification email
        const emailResult = await sendVerificationEmail(
            email,
            name,
            verificationToken,
        );

        if (!emailResult.success) {
            console.error("Failed to send verification email");
        }

        return NextResponse.json(
            {
                message:
                    "User created successfully. Please check your email to verify your account.",
                userId: result.insertedId.toString(),
                email: email,
            },
            { status: 201 },
        );
    } catch (error) {
        console.error("Signup error:", error);
        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 },
        );
    }
}
