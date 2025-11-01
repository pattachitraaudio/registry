import { NextRequest } from "next/server";
import { APIResponseCode } from "@/enums/APIResponseCode";
import { ObjectId } from "mongodb";

import {
    APISessionErrorResponse,
    APISessionJWTErrorResponse,
    APISessionSuccessResponse,
} from "@/classes/apiResponses/session";

import { APIErrorResponse } from "@/classes/apiResponses/APIResponse";
import { ServiceManager } from "@/classes/xServiceManager";
import { MUser } from "@/models/mUser";

export async function GET(
    req: NextRequest,
): Promise<APISessionSuccessResponse | APISessionErrorResponse | APIErrorResponse> {
    const Code = APIResponseCode.Error.Session;
    const serviceManager = await new ServiceManager().setup();
    const cookieManager = serviceManager.cookieManager;

    try {
        const cookie = req.cookies.get(cookieManager.name)?.value;

        if (!cookie) {
            throw new APISessionJWTErrorResponse(401, {
                code: Code.JWT.NOT_PRESENT,
                message: "JWT not present",
            });
        }

        const sessionPayload = await cookieManager.verify(cookie);
        const db = serviceManager.mongoDBClient.db("registry");
        const userCollection = db.collection<MUser>("users");
        const user = await userCollection.findOne({ _id: ObjectId.createFromHexString(sessionPayload.id) });

        if (!user) {
            throw new APISessionErrorResponse(404, {
                code: Code.USER_NOT_FOUND,
                message: "User not found",
            });
        }

        return new APISessionSuccessResponse({
            code: APIResponseCode.SUCCESS,
            message: "Everything looks good",
            data: {
                user: {
                    name: user.name,
                    email: user.email,
                },
            },
        });
    } catch (err) {
        if (err instanceof APISessionErrorResponse) {
            return err;
        }

        return new APIErrorResponse(500, {
            code: APIResponseCode.Error.UNKNOWN_ERROR,
            message: "whoa! that's an unknown err in the /session route",
        });
    }
}
