import { NextResponse } from "next/server";
import { getSession } from "@/lib/session";

export async function GET() {
    try {
        const session = await getSession();

        if (!session) {
            return NextResponse.json(
                { error: "Not authenticated" },
                { status: 401 },
            );
        }

        return NextResponse.json(
            {
                user: {
                    _id: session.userId,
                    email: session.email,
                    name: session.name,
                },
            },
            { status: 200 },
        );
    } catch (error) {
        console.error("Session validation error:", error);
        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 },
        );
    }
}
