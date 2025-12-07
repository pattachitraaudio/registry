import { bEmail } from "@/brands/email";
import { dbClientPromise } from "@/lib/db";
import { xNoThrowFn } from "@/lib/xNoThrow";
import { Binary, DeleteOptions, Filter, FindOneOptions, InsertOneOptions, ObjectId } from "mongodb";

export interface mEmailVfToken {
    _id: Binary;
    userID: ObjectId;
    email: bEmail;
    createdAt: Date;
    expiry: Date;
}

export const mEmailVfTokenPromise = (async function () {
    const dbClientResult = await dbClientPromise;

    if (dbClientResult.err != null) {
        return dbClientResult;
    }

    const collection = dbClientResult.ret.db("registry").collection<mEmailVfToken>("emailVfTokens");

    return xNoThrowFn.ret({
        async findOne(filter: Filter<mEmailVfToken>, options?: FindOneOptions) {
            try {
                return xNoThrowFn.ret(await collection.findOne(filter, options));
            } catch (err) {
                return xNoThrowFn.err({ err: "Unknown err while performing findOne on collection 'emailVfTokens'" });
            }
        },

        async insertOne(emailVfToken: mEmailVfToken, options?: InsertOneOptions) {
            try {
                return xNoThrowFn.ret(await collection.insertOne(emailVfToken, options));
            } catch (err) {
                return xNoThrowFn.err({ err: "Unknown err while performing insertOne on collection 'emailVfToken'" });
            }
        },

        async deleteOne(filter: Filter<mEmailVfToken>, options?: DeleteOptions) {
            try {
                return xNoThrowFn.ret(await collection.deleteOne(filter, options));
            } catch (err) {
                return xNoThrowFn.err({ err: "Unknown err while performing deleteOne on collection 'emailVfToken'" });
            }
        },
    });
})();
