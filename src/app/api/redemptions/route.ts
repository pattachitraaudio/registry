/*
import { NextResponse } from "next/server";
import { ObjectId } from "mongodb";
import clientPromise from "@/lib/mongodb";
import { MUser } from "@/models/MUser";
import { Redemption } from "@/models/Redemption";
import { ACCOUNT_VALUE_INR } from "@/config/constants";

// POST - Create a new redemption
export async function POST(request: Request) {
    try {
        const { userId, accountsToRedeem } = await request.json();

        if (!userId || !accountsToRedeem || accountsToRedeem <= 0) {
            return NextResponse.json(
                { error: "Invalid request data" },
                { status: 400 },
            );
        }

        const client = await clientPromise;
        const db = client.db();
        const usersCollection = db.collection<User>("users");
        const redemptionsCollection = db.collection<Redemption>("redemptions");

        // Get user and check if they have enough unredeemed accounts
        const user = await usersCollection.findOne({
            _id: new ObjectId(userId),
        });

        if (!user) {
            return NextResponse.json(
                { error: "User not found" },
                { status: 404 },
            );
        }

        // Get total accounts
        const accountsCollection = db.collection("accounts");
        const totalAccounts = await accountsCollection.countDocuments({
            userId: new ObjectId(userId),
        });

        const accountsRedeemed = user.accountsRedeemed || 0;
        const availableToRedeem = totalAccounts - accountsRedeemed;

        if (accountsToRedeem > availableToRedeem) {
            return NextResponse.json(
                {
                    error: `Only ${availableToRedeem} accounts available to redeem`,
                },
                { status: 400 },
            );
        }

        const totalValue = accountsToRedeem * ACCOUNT_VALUE_INR;

        // Create redemption record
        const newRedemption: Redemption = {
            userId: new ObjectId(userId),
            accountsRedeemed: accountsToRedeem,
            totalValue,
            redeemedAt: new Date(),
        };

        await redemptionsCollection.insertOne(newRedemption);

        // Update user's accountsRedeemed count
        await usersCollection.updateOne(
            { _id: new ObjectId(userId) },
            {
                $inc: { accountsRedeemed: accountsToRedeem },
            },
        );

        return NextResponse.json(
            {
                message: "Redemption successful",
                accountsRedeemed: accountsToRedeem,
                totalValue,
            },
            { status: 201 },
        );
    } catch (error) {
        console.error("Redeem accounts error:", error);
        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 },
        );
    }
}

// GET - Get redemption history for a user
export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        const userId = searchParams.get("userId");

        if (!userId) {
            return NextResponse.json(
                { error: "User ID is required" },
                { status: 400 },
            );
        }

        const client = await clientPromise;
        const db = client.db();
        const redemptionsCollection = db.collection<Redemption>("redemptions");

        const redemptions = await redemptionsCollection
            .find({ userId: new ObjectId(userId) })
            .sort({ redeemedAt: -1 })
            .toArray();

        const sanitizedRedemptions = redemptions.map((redemption) => ({
            _id: redemption._id?.toString(),
            accountsRedeemed: redemption.accountsRedeemed,
            totalValue: redemption.totalValue,
            redeemedAt: redemption.redeemedAt,
        }));

        return NextResponse.json(
            { redemptions: sanitizedRedemptions },
            { status: 200 },
        );
    } catch (error) {
        console.error("Get redemption history error:", error);
        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 },
        );
    }
}

*/

import { APIResponseCode } from "@/enums/APIResponseCode";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
    return NextResponse.json({ status: APIResponseCode.WORK_IN_PROGRESS, message: "Work in progress" });
}
