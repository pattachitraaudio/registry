import { NextResponse } from "next/server";
import { ObjectId } from "mongodb";
import clientPromise from "@/lib/mongodb";
import { Account } from "@/models/Account";

// GET - Fetch all accounts for a user
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
        const accountsCollection = db.collection<Account>("accounts");

        const accounts = await accountsCollection
            .find({ userId: new ObjectId(userId) })
            .sort({ createdAt: -1 })
            .toArray();

        // Remove sensitive password from response (but keep apiKey)
        const sanitizedAccounts = accounts.map((account) => ({
            _id: account._id?.toString(),
            email: account.email,
            apiKey: account.apiKey,
            isActive: account.isActive,
            isRedeemed: account.isRedeemed || false,
            validationData: account.validationData,
            createdAt: account.createdAt,
            updatedAt: account.updatedAt,
        }));

        return NextResponse.json(
            { accounts: sanitizedAccounts },
            { status: 200 },
        );
    } catch (error) {
        console.error("Get accounts error:", error);
        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 },
        );
    }
}

// POST - Add a new account
export async function POST(request: Request) {
    try {
        const { userId, email, password, apiKey, validationData } =
            await request.json();

        if (!userId || !email || !password || !apiKey) {
            return NextResponse.json(
                { error: "Missing required fields" },
                { status: 400 },
            );
        }

        const client = await clientPromise;
        const db = client.db();
        const accountsCollection = db.collection<Account>("accounts");

        // Check if account with this email already exists for this user
        const existingAccount = await accountsCollection.findOne({
            userId: new ObjectId(userId),
            email,
        });

        if (existingAccount) {
            return NextResponse.json(
                { error: "Account with this email already exists" },
                { status: 409 },
            );
        }

        const newAccount: Account = {
            userId: new ObjectId(userId),
            email,
            password,
            apiKey,
            validationData,
            isActive: true,
            isRedeemed: false,
            createdAt: new Date(),
            updatedAt: new Date(),
        };

        const result = await accountsCollection.insertOne(newAccount);

        return NextResponse.json(
            {
                message: "Account added successfully",
                accountId: result.insertedId.toString(),
            },
            { status: 201 },
        );
    } catch (error) {
        console.error("Add account error:", error);
        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 },
        );
    }
}

// DELETE - Remove an account
export async function DELETE(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        const accountId = searchParams.get("accountId");
        const userId = searchParams.get("userId");

        if (!accountId || !userId) {
            return NextResponse.json(
                { error: "Account ID and User ID are required" },
                { status: 400 },
            );
        }

        const client = await clientPromise;
        const db = client.db();
        const accountsCollection = db.collection<Account>("accounts");

        // Verify the account belongs to the user before deleting
        const result = await accountsCollection.deleteOne({
            _id: new ObjectId(accountId),
            userId: new ObjectId(userId),
        });

        if (result.deletedCount === 0) {
            return NextResponse.json(
                { error: "Account not found or unauthorized" },
                { status: 404 },
            );
        }

        return NextResponse.json(
            { message: "Account deleted successfully" },
            { status: 200 },
        );
    } catch (error) {
        console.error("Delete account error:", error);
        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 },
        );
    }
}
