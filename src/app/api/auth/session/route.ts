import { NextRequest } from "next/server";
import { APIResCode } from "@/enums/APIResCode";
import { ObjectId } from "mongodb";

import { xAPISessSuccRes, xAPISessErrRes, tAPISessRes } from "@/types/apiResponse/auth/session";

import { xAPIErrRes } from "@/types/apiResponse/xAPIRes";
import { ServiceManager } from "@/classes/xServiceManager";
import { mUser } from "@/lib/db/models/mUser";

export async function GET(req: NextRequest): Promise<tAPISessRes> {
    const Code = APIResCode.Error.Session;
    const service = await new ServiceManager().setup();
    const cookieManager = service.cookieManager;

    try {
        const sessionPayload = await cookieManager.verify(req.cookies.get(cookieManager.name)?.value);
        const db = service.mongoDBClient.db("registry");
        const userCollection = db.collection<mUser>("users");
        const user = await userCollection.findOne({ _id: ObjectId.createFromHexString(sessionPayload.id) });

        if (!user) {
            return new xAPISessErrRes(404, {
                code: Code.USER_NOT_FOUND,
                message: "User not found",
            });
        }

        return new xAPISessSuccRes({
            code: APIResCode.SUCCESS,
            message: "Everything looks good",
            data: {
                user: {
                    name: user.name,
                    email: user.email,
                },
            },
        });
    } catch (err) {
        if (err instanceof xAPIErrRes) {
            return err;
        }

        return new xAPIErrRes(500, {
            code: APIResCode.Error.UNKNOWN_ERROR,
            message: "whoa! that's an unknown err in the /session route",
        });
    }
}
