/*
import { NextResponse } from "next/server";
import crypto from "crypto";
import clientPromise from "@/lib/mongoDB";
import { User } from "@/models/MUser";
import { sendVerificationEmail } from "@/lib/email";

export async function POST(request: Request) {
    try {
        const { email } = await request.json();

        if (!email) {
            return NextResponse.json({ error: "Email is required" }, { status: 400 });
        }

        const client = await clientPromise;
        const db = client.db();
        const usersCollection = db.collection<User>("users");

        const user = await usersCollection.findOne({ email });

        if (!user) {
            return NextResponse.json({ error: "User not found" }, { status: 404 });
        }

        if (user.isVerified) {
            return NextResponse.json({ error: "Email is already verified" }, { status: 400 });
        }

        // Generate new verification token
        const verificationToken = crypto.randomBytes(32).toString("hex");
        const verificationTokenExpiry = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours

        await usersCollection.updateOne(
            { _id: user._id },
            {
                $set: {
                    verificationToken,
                    verificationTokenExpiry,
                },
            },
        );

        // Send verification email
        const emailResult = await sendVerificationEmail(email, user.name, verificationToken);

        if (!emailResult.success) {
            return NextResponse.json({ error: "Failed to send verification email" }, { status: 500 });
        }

        return NextResponse.json(
            {
                message: "Verification email sent successfully",
            },
            { status: 200 },
        );
    } catch (error) {
        console.error("Resend verification error:", error);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}

*/
import { APIResponseCode } from "@/app/enums/APIResponseCode";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
    return NextResponse.json({ status: APIResponseCode.WORK_IN_PROGRESS, message: "Work in progress" });
}
