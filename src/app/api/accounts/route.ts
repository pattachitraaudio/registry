import { NextResponse } from "next/server";
import { ObjectId } from "mongodb";
// import clientPromise from "@/lib/mongodb";
import { Globals } from "@/config/globals";
import { MAccount } from "@/models/MAccount";
import { ErrorResponse } from "@/interfaces/APIResponses/ErrorResponse";
import { SuccessResponse } from "@/interfaces/APIResponses/SuccessResponse";
import { APIResponseCode } from "@/app/enums/APIResponseCode";
// import { Global } from "recharts";
import { UserResponse } from "@/interfaces/APIResponses/elevenlabs/UserResponse";
import { getSession } from "@/lib/session";
import { IAccount } from "@/interfaces/IAccount";
import { AccountsResponse } from "@/interfaces/APIResponses/AccountsResponse";

// GET - Fetch all accounts for a user
export async function GET(request: Request): Promise<NextResponse<ErrorResponse> | NextResponse<AccountsResponse>> {
    try {
        /*
        const { searchParams } = new URL(request.url);
        const id = searchParams.get("id");

        if (!id) {
            return NextResponse.json({ error: "User ID is required" }, { status: 400 });
        }

        */
        /*
        const client = await clientPromise;
        const db = client.db();
        const accountsCollection = db.collection<MAccount>("accounts");
        */

        /*
        const accounts = await accountsCollection
            .find({ userid: new objectid(userid) })
            .sort({ createdat: -1 })
            .toarray();
            */

        try {
            const session = await getSession();

            //const accounts = await Globals.mongoDB.accounts().find({ userID: ObjectId.createFromHexString(session.id) });
            // TODO: fix this
            const accounts = await (
                await Globals.mongoDB.accounts().find({ userID: ObjectId.createFromHexString(session.id) })
            )
                .sort({
                    createdOn: -1,
                })
                .toArray();
            /*
            .sort({ createdAt: -1 })
            .toArray();
            */

            // Remove sensitive password from response (but keep apiKey)
            /*
        const sanitizedAccounts = accounts.map((account) => ({
            _id: account._id?.toString(),
            email: account.email,
            apiKey: account.apiKey,
            // isActive: account.isActive,
            // validationData: account.validationData,
            // createdAt: account.createdAt,
            // updatedAt: account.updatedAt,
        }));
        */

            return NextResponse.json(
                {
                    status: APIResponseCode.SUCCESS,
                    data: {
                        accounts: accounts.map((account): IAccount => {
                            return { id: account._id, email: account.email, apiKey: account.apiKey };
                        }),
                    },
                },
                { status: 200 },
            );
        } catch {
            return NextResponse.json(
                { status: APIResponseCode.GENERIC_ERROR, message: "Invalid session" },
                { status: 403 },
            );
        }
    } catch (error) {
        console.error("Get accounts error:", error);
        return NextResponse.json(
            { status: APIResponseCode.GENERIC_ERROR, message: "Internal server error" },
            { status: 500 },
        );
    }
}

// POST - Add a new account
export async function POST(request: Request): Promise<NextResponse<ErrorResponse> | NextResponse<SuccessResponse>> {
    try {
        const session = await getSession();

        if (session == null) {
            return NextResponse.json(
                { status: APIResponseCode.SessionError.INVALID_JWT, message: "Session is not valid" },
                { status: 401 },
            );
        }

        const { email, password, apiKey } = await request.json();

        /* TODO: validate properly using zod */
        if (!email || !password || !apiKey) {
            return NextResponse.json(
                { status: APIResponseCode.GENERIC_ERROR, message: "Missing required fields" },
                { status: 400 },
            );
        }

        const elevenlabsRes = await fetch("https://api.elevenlabs.io/v1/user", {
            headers: {
                "xi-api-key": apiKey,
            },
        });

        if (elevenlabsRes.status !== 200) {
            return NextResponse.json({
                status: APIResponseCode.GENERIC_ERROR,
                message: JSON.stringify(elevenlabsRes),
            });
        }

        const elevenLabsResObj = (await elevenlabsRes.json()) as UserResponse;

        const accounts = Globals.mongoDB.accounts();

        // Check if account with this id
        const existingAccount = await accounts.findOne({
            _id: elevenLabsResObj.user_id,
        });

        if (existingAccount) {
            return NextResponse.json(
                {
                    status: APIResponseCode.GENERIC_ERROR,
                    message: `Account with this userID (${existingAccount._id}) already exists`,
                },
                { status: 409 },
            );
        }

        const account: MAccount = {
            _id: elevenLabsResObj.user_id,
            userID: ObjectId.createFromHexString(session.id),
            email,
            password,
            apiKey,
            createdOn: new Date(),
        };

        const result = await accounts.insertOne(account);

        return NextResponse.json(
            {
                status: APIResponseCode.SUCCESS,
                message: "Account added successfully",
                accountId: result.insertedId.toString(),
            },
            { status: 201 },
        );
    } catch (error) {
        console.error("Add account error:", error);

        return NextResponse.json(
            { status: APIResponseCode.GENERIC_ERROR, message: "Internal server error" },
            { status: 500 },
        );
    }
}

// DELETE - Remove an account
export async function DELETE(request: Request): Promise<NextResponse<ErrorResponse> | NextResponse<SuccessResponse>> {
    try {
        const { searchParams } = new URL(request.url);
        const id = searchParams.get("id");
        // const userId = searchParams.get("userId");
        const session = await getSession();

        if (session == null) {
            return NextResponse.json(
                { status: APIResponseCode.GENERIC_ERROR, message: "Invalid session" },
                { status: 403 },
            );
        }

        // TODO: add zod validation where accountID must be a hex string
        /*
         */
        if (!id) {
            return NextResponse.json(
                { status: APIResponseCode.GENERIC_ERROR, message: "Invalid Account ID" },
                { status: 404 },
            );
        }

        // const accounts = await Globals.mongoDB.collection("")

        // Verify the account belongs to the user before deleting
        /*
        const result = await Globals.mongoDB.accounts().deleteOne({
            _id: id,
            userId: ObjectId.createFromHexString(session.id),
        });
        */

        /*
        const result = await Globals.mongoDB.accounts().updateOne(
            { _id: id, userID: ObjectId.createFromHexString(session.id) },
            {
                $set: {
                    flaggedForDeletion: true,
                },
            },
        );
        */

        const result = await Globals.mongoDB.accounts().findOneAndDelete({
            _id: id,
            userID: ObjectId.createFromHexString(session.id),
        });

        if (result == null) {
            return NextResponse.json(
                { status: APIResponseCode.GENERIC_ERROR, message: "Account not found" },
                { status: 404 },
            );
        }

        await Globals.mongoDB.deletedAccounts().insertOne({
            ...result,
            deletedOn: new Date(),
        });

        return NextResponse.json(
            { status: APIResponseCode.SUCCESS, message: "Account deleted successfully" },
            { status: 200 },
        );
    } catch (error) {
        console.error("Delete account error:", error);
        return NextResponse.json(
            { status: APIResponseCode.GENERIC_ERROR, message: "Internal server error" },
            { status: 500 },
        );
    }
}
