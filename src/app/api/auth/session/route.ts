import { NextResponse } from "next/server";
import { getSession } from "@/lib/session";
import { ErrorResponse } from "@/interfaces/APIResponses/ErrorResponse";
import { APIResponseCode } from "@/app/enums/APIResponseCode";
import { Globals } from "@/config/globals";
import { ObjectId } from "mongodb";
import { UserResponse } from "@/interfaces/APIResponses/UserResponse";

export async function GET(): Promise<NextResponse<ErrorResponse> | NextResponse<UserResponse>> {
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
                    { status: 404 },
                );
            }

            return NextResponse.json(
                {
                    status: APIResponseCode.SUCCESS,
                    data: { id: user._id.toHexString(), name: user.name, email: user.email },
                },
                { status: 200 },
            );
        } catch {
            return NextResponse.json(
                {
                    status: APIResponseCode.SessionError.INVALID_JWT,
                    message: "Not authenticated",
                },
                { status: 403 },
            );
        }
    } catch (error) {
        console.error("Session validation error:", error);
        return NextResponse.json({ status: APIResponseCode.GENERIC_ERROR, message: "Generic error" }, { status: 500 });
    }
}
