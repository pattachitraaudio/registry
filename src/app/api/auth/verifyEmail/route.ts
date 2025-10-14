import { NextResponse } from "next/server";
// import clientPromise from "@/lib/mongoDB";
import { MUser } from "@/models/MUser";
import { Globals } from "@/config/globals";
import { ObjectId } from "mongodb";
import { ErrorResponse } from "@/interfaces/APIResponses/ErrorResponse";
import { SuccessResponse } from "@/interfaces/APIResponses/SuccessResponse";
import { APIResponseCode } from "@/app/enums/APIResponseCode";

export async function POST(request: Request): Promise<NextResponse<ErrorResponse> | NextResponse<SuccessResponse>> {
    try {
        const { token } = await request.json();

        if (!token) {
            NextResponse.json(
                { status: APIResponseCode.GENERIC_ERROR, message: "Verification token is required" },
                { status: 400 },
            );
        }

        const id = ObjectId.createFromHexString(token);

        const emailVerificationTokens = Globals.mongoDB.emailVerificationTokens();
        const emailVerificationToken = await emailVerificationTokens.findOne({ _id: id });

        if (!emailVerificationToken) {
            return NextResponse.json(
                { status: APIResponseCode.GENERIC_ERROR, message: "Verification token not found" },
                { status: 404 },
            );
        }

        if (emailVerificationToken.expiry < new Date()) {
            emailVerificationTokens.deleteOne({ _id: id });

            return NextResponse.json(
                { status: APIResponseCode.GENERIC_ERROR, message: "Verification token has expired" },
                { status: 410 },
            );
        }

        const users = Globals.mongoDB.users();
        const user = await users.findOne({ _id: emailVerificationToken.userID });

        if (!user) {
            return NextResponse.json(
                {
                    status: APIResponseCode.GENERIC_ERROR,
                    message: "User not found",
                },
                { status: 404 },
            );
        }

        // TODO: make these two updates a transaction
        await users.updateOne(
            { _id: user._id },
            {
                $set: {
                    isVerified: true,
                },
            },
        );

        await emailVerificationTokens.deleteOne({ _id: id });

        return NextResponse.json(
            {
                status: APIResponseCode.SUCCESS,
                message: "Email verified successfully",
            },
            { status: 200 },
        );
    } catch (error) {
        console.error("Email verification error:", error);
        return NextResponse.json(
            { status: APIResponseCode.GENERIC_ERROR, message: "Internal server error" },
            { status: 500 },
        );
    }
}
