import { APIResCode } from "@/enums/APIResCode";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
    return NextResponse.json({ status: APIResCode.WORK_IN_PROGRESS, message: "Work in progress" });
}
