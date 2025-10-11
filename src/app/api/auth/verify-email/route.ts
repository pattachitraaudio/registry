import { NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";
import { User } from "@/models/User";

export async function POST(request: Request) {
    try {
        const { token } = await request.json();

        if (!token) {
            return NextResponse.json(
                { error: "Verification token is required" },
                { status: 400 },
            );
        }

        const client = await clientPromise;
        const db = client.db();
        const usersCollection = db.collection<User>("users");

        const user = await usersCollection.findOne({
            verificationToken: token,
        });

        if (!user) {
            return NextResponse.json(
                { error: "Invalid verification token" },
                { status: 400 },
            );
        }

        if (user.isVerified) {
            return NextResponse.json(
                { error: "Email is already verified" },
                { status: 400 },
            );
        }

        if (
            user.verificationTokenExpiry &&
            user.verificationTokenExpiry < new Date()
        ) {
            return NextResponse.json(
                { error: "Verification token has expired" },
                { status: 400 },
            );
        }

        await usersCollection.updateOne(
            { _id: user._id },
            {
                $set: {
                    isVerified: true,
                },
                $unset: {
                    verificationToken: "",
                    verificationTokenExpiry: "",
                },
            },
        );

        return NextResponse.json(
            {
                message: "Email verified successfully",
            },
            { status: 200 },
        );
    } catch (error) {
        console.error("Email verification error:", error);
        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 },
        );
    }
}
