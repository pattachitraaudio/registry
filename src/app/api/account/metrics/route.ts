/*
import { NextResponse } from "next/server";
import { ObjectId } from "mongodb";
// import clientPromise from "@/lib/mongoDB";
import { MAccount } from "@/models/MAccount";
import { mUser } from "@/models/mUser";
import { ACCOUNT_VALUE_INR } from "@/config/constants";

export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        const userId = searchParams.get("userId");
        const period = searchParams.get("period") || "month"; // day, week, month

        if (!userId) {
            return NextResponse.json({ error: "User ID is required" }, { status: 400 });
        }

        const client = await clientPromise;
        const db = client.db();
        const accountsCollection = db.collection<MAccount>("accounts");
        const usersCollection = db.collection<mUser>("users");

        // Get user to fetch accountsRedeemed
        const user = await usersCollection.findOne({
            _id: new ObjectId(userId),
        });

        if (!user) {
            return NextResponse.json({ error: "User not found" }, { status: 404 });
        }

        // Get all accounts for the user
        const accounts = await accountsCollection.find({ userId: new ObjectId(userId) }).toArray();

        const totalAccounts = accounts.length;
        const accountsRedeemed = user.accountsRedeemed || 0;
        const unredeemedAccounts = totalAccounts - accountsRedeemed;

        // Calculate current month's accounts
        const now = new Date();
        const currentMonthStart = new Date(now.getFullYear(), now.getMonth(), 1);
        const currentMonthAccounts = accounts.filter((account) => new Date(account.createdAt) >= currentMonthStart);

        // Calculate total claimable value
        const totalClaimableValue = unredeemedAccounts * ACCOUNT_VALUE_INR;

        // Group accounts by time period for chart data
        const chartData = getChartData(accounts, period);

        return NextResponse.json(
            {
                totalAccounts,
                currentMonthAccounts: currentMonthAccounts.length,
                accountsRedeemed,
                unredeemedAccounts,
                totalClaimableValue,
                accountValueINR: ACCOUNT_VALUE_INR,
                chartData,
            },
            { status: 200 },
        );
    } catch (error) {
        console.error("Get metrics error:", error);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}

function getChartData(accounts: Account[], period: string): { label: string; count: number }[] {
    const data: { [key: string]: number } = {};

    accounts.forEach((account) => {
        const date = new Date(account.createdAt);
        let key: string;

        if (period === "day") {
            // Format: YYYY-MM-DD
            key = date.toISOString().split("T")[0];
        } else if (period === "week") {
            // Format: YYYY-Www (week number)
            const year = date.getFullYear();
            const weekNum = getWeekNumber(date);
            key = `${year}-W${String(weekNum).padStart(2, "0")}`;
        } else {
            // month (default)
            // Format: YYYY-MM
            key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;
        }

        data[key] = (data[key] || 0) + 1;
    });

    // Convert to array and sort by date
    const sortedData = Object.entries(data)
        .map(([label, count]) => ({
            label,
            count,
        }))
        .sort((a, b) => a.label.localeCompare(b.label));

    // Limit the number of data points based on period
    const limit = period === "day" ? 30 : period === "week" ? 12 : 6;
    return sortedData.slice(-limit);
}

function getWeekNumber(date: Date): number {
    const d = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
    const dayNum = d.getUTCDay() || 7;
    d.setUTCDate(d.getUTCDate() + 4 - dayNum);
    const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
    const weekNo = Math.ceil(((d.getTime() - yearStart.getTime()) / 86400000 + 1) / 7);
    return weekNo;
}
*/

import { APIResCode } from "@/enums/APIResCode";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
    return NextResponse.json({ status: APIResCode.WORK_IN_PROGRESS, message: "Work in progress" });
}
