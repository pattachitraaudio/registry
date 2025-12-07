import { CONSTANT } from "@/constants/constant";
import { MongoClient } from "mongodb";
import { envPromise } from "../env";
import { xNoThrowFn } from "../xNoThrow";

export const dbClientPromise = (async function () {
    const env = (await envPromise).ret;
    try {
        const mongoDBClient = await new MongoClient(env.MONGODB_URI, {
            appName: CONSTANT.appInfo.name,
        }).connect();
        return xNoThrowFn.ret(mongoDBClient);
    } catch (err) {
        console.error("Error connecting to mongoDB");
        return xNoThrowFn.err({ err: "Backend failed to connect to db" });
    }
})();
