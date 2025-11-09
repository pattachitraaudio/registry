import { NextRequest, NextResponse } from "next/server";
import { ObjectId } from "mongodb";
import { APIAccGetElevenLabsRes, xAPIAccGetElevenLabsSuccRes } from "@/types/apiResponse/account/elevenLabs/get";
import { ServiceManager } from "@/classes/xServiceManager";
import { mElevenlabsAccount } from "@/models/account/mElevenlabsAccount";
import { xAPIErrRes } from "@/types/apiResponse/xAPIRes";
import { APIResCode } from "@/enums/APIResCode";
import { xAPISessErrRes, xAPISessJWTErrRes } from "@/types/apiResponse/auth/session";

export async function GET(req: NextRequest): Promise<xAPISessJWTErrRes | xAPISessErrRes | APIAccGetElevenLabsRes> {
    try {
        const service = await new ServiceManager().setup();
        const cookieManager = service.cookieManager;
        const sessionPayload = await cookieManager.verify(req.cookies.get(cookieManager.name)?.value);
        const mongoDBClient = service.mongoDBClient;

        const accounts = await mongoDBClient
            .db("account")
            .collection<mElevenlabsAccount>("elevenLabs")
            .find({ createdByUserID: ObjectId.createFromHexString(sessionPayload.id) })
            .sort({ createdAt: -1 })
            .toArray();

        return new xAPIAccGetElevenLabsSuccRes({
            code: APIResCode.SUCCESS,
            message: "All yours accounts sire/madame!🙏🏻",
            data: { accounts: accounts.map((acc) => ({ apiKey: acc.apiKey, email: acc.email })) },
        });
    } catch (err) {
        if (err instanceof xAPIErrRes) {
            return err;
        }

        return new xAPIErrRes(500, {
            code: APIResCode.Error.UNKNOWN_ERROR,
            message: "whoops, that's an unknown server error in this route",
        });
    }
}
