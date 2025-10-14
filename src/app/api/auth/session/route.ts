import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/session";
import { cookies } from "next/headers";
import { ErrorResponse } from "@/interfaces/APIResponses/ErrorResponse";
import { SessionResponse } from "@/interfaces/APIResponses/SessionResponse";
import { APIResponseCode } from "@/app/enums/APIResponseCode";
import { IUser } from "@/interfaces/IUser";
import { Globals } from "@/config/globals";
import { ObjectId } from "mongodb";
import { UserResponse } from "@/interfaces/APIResponses/UserResponse";

export async function GET(request: NextRequest): Promise<NextResponse<ErrorResponse> | NextResponse<UserResponse>> {
    try {
        try {
            const sessionPayload = await getSession();
            const user = await Globals.mongoDB
                .users()
                .findOne({ _id: ObjectId.createFromHexString(sessionPayload.id) });

            if (!user) {
                return NextResponse.json(
                    {
                        status: APIResponseCode.SessionError.USER_NOT_FOUND,
                        message: "User not found",
                    },
                    { status: 200 },
                );
            }

            return NextResponse.json(
                {
                    status: APIResponseCode.SUCCESS,
                    data: { id: user._id.toHexString(), name: user.name, email: user.email },
                },
                { status: 200 },
            );
        } catch (err: unknown) {
            return NextResponse.json({
                status: APIResponseCode.SessionError.INVALID_JWT,
                message: "Not authenticated",
            });
        }
    } catch (error) {
        console.error("Session validation error:", error);
        return NextResponse.json({ status: APIResponseCode.GENERIC_ERROR, message: "Generic error" }, { status: 500 });
    }
}
