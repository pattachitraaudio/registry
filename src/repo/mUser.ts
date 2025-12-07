import { Filter, InsertOneOptions, MongoError, ObjectId, UpdateFilter, UpdateOptions } from "mongodb";
import { xNoThrowFn } from "@/lib/xNoThrow";
import { dbClientPromise } from "@/lib/db";
import { bEmail } from "@/brands/email";
import { bName } from "@/brands/name";
import { bReferralCode } from "@/brands/referralCode";
import { bHashedPassword } from "@/lib/crypto/password";

export interface mUser {
    _id: ObjectId;
    email: bEmail;
    hashedPassword: bHashedPassword;
    name: bName;
    isVerified: boolean;
    createdAt: Date;
    referredBy: ObjectId;
    referralCode: bReferralCode;
    accountSuspended?: boolean;
    permissions: Record<string, boolean>;
}

export const mUserPromise = (async function () {
    const dbClientResult = await dbClientPromise;

    if (dbClientResult.err != null) {
        return dbClientResult;
    }

    const collection = dbClientResult.ret.db("registry").collection<mUser>("users");

    return xNoThrowFn.ret({
        async findOne(filter: Filter<mUser>) {
            try {
                return xNoThrowFn.ret(await collection.findOne(filter));
            } catch (err) {
                if (err instanceof MongoError) {
                    return xNoThrowFn.err(err.message);
                }

                return xNoThrowFn.err({ err: "Unknown err while performing findOne" });
            }
        },

        async insertOne(user: mUser, options?: InsertOneOptions) {
            try {
                return xNoThrowFn.ret(await collection.insertOne(user, options));
            } catch (err) {
                return xNoThrowFn.err({ err: "Unknown err while performing insertOne" });
            }
        },

        async updateOne(filter: Filter<mUser>, update: UpdateFilter<mUser>, options?: UpdateOptions) {
            try {
                return xNoThrowFn.ret(await collection.updateOne(filter, update, options));
            } catch (err) {
                return xNoThrowFn.err({ err: " Unknown err while performing updateOne on collection 'users'" });
            }
        },
    });
})();
