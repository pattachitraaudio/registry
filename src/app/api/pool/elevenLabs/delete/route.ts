import { ServiceManager } from "@/classes/xServiceManager";
import { APIResCode } from "@/enums/APIResCode";
import { mElevenlabsAccount } from "@/lib/db/models/account/mElevenlabsAccount";
import {
    APIAccDeleteElevenLabsRes,
    xAPIAccDeleteElevenLabsErrRes,
    xAPIAccDeleteElevenLabsParamsIDErrRes,
    xAPIAccDeleteElevenLabsSuccRes,
} from "@/types/apiResponse/account/elevenLabs/delete";
import { xAPISessErrRes, xAPISessJWTErrRes } from "@/types/apiResponse/auth/session";
import { xAPIErrRes } from "@/types/apiResponse/xAPIRes";
import { NextRequest } from "next/server";

const AccDeleteElevenLabsErrCode = APIResCode.Error.Account.ElevenLabs.Delete;
// DELETE - Remove an account
function validateID(searchParams: URLSearchParams): string {
    const id = searchParams.get("id");

    if (id == null) {
        throw new xAPIAccDeleteElevenLabsParamsIDErrRes({
            code: AccDeleteElevenLabsErrCode.Params.ID.NOT_PRESENT,
            message: "Missing id in the queryParams",
        });
    }

    /*
    if (idString.length < 24) {
        throw new xAPIAccDeleteElevenLabsParamsIDErrRes({
            code: AccDeleteElevenLabsErrCode.Params.ID.TOO_SHORT,
            message: "Invalid id: must be 24 characters long",
        });
    }

    if (idString.length > 24) {
        throw new xAPIAccDeleteElevenLabsParamsIDErrRes({
            code: AccDeleteElevenLabsErrCode.Params.ID.TOO_LONG,
            message: "Invalid id: must be 24 characters long",
        });
    }

    if (!/^[0-9a-f]+$/i.test(idString)) {
        throw new xAPIAccDeleteElevenLabsParamsIDErrRes({
            code: AccDeleteElevenLabsErrCode.Params.ID.INVALID_CHARACTER_FOUND,
            message: "Invalid id: must contain only hexadecimal characters (0-9, a-f)",
        });
    }
        */

    // return ObjectId.createFromHexString(idString);
    return id;
}

export async function DELETE(
    req: NextRequest,
): Promise<xAPISessJWTErrRes | xAPISessErrRes | APIAccDeleteElevenLabsRes | xAPIErrRes> {
    try {
        const id = validateID(new URL(req.url).searchParams);
        const service = await new ServiceManager().setup();
        await service.cookieManager.verify(req.cookies.get(service.cookieManager.name)?.value);

        const elevenLabsCollection = service.mongoDBClient.db("account").collection<mElevenlabsAccount>("elevenLabs");
        const elevenLabsDeletedCollection = service.mongoDBClient
            .db("deletedAccount")
            .collection<mElevenlabsAccount>("elevenLabs");

        const mongoDBSession = service.mongoDBClient.startSession();

        try {
            mongoDBSession.startTransaction();
            const result = await elevenLabsCollection.findOneAndDelete({ _id: id }, { session: mongoDBSession });

            if (result == null) {
                throw new xAPIAccDeleteElevenLabsErrRes(404, {
                    code: AccDeleteElevenLabsErrCode.ACCOUNT_ID_NOT_FOUND,
                    message: "Account not found in database",
                });
            }

            await elevenLabsDeletedCollection.insertOne(result, { session: mongoDBSession });

            mongoDBSession.commitTransaction();

            const res = new xAPIAccDeleteElevenLabsSuccRes({
                data: {
                    apiKey: result.apiKey,
                },
                code: APIResCode.SUCCESS,
                message: "Account deleted successfully",
            });

            return res;
        } catch (err) {
            mongoDBSession.abortTransaction();
            throw err;
        } finally {
            mongoDBSession.endSession();
        }
    } catch (err) {
        if (err instanceof xAPIErrRes) {
            return err;
        }

        return new xAPIErrRes(500, {
            code: APIResCode.Error.UNKNOWN_ERROR,
            message: "Whoa, that's an unknown err",
        });
    }
}
