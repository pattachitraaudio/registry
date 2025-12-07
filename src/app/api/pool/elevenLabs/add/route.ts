import { sElevenLabsUserResSchema, tElevenLabsUserRes } from "@/schemas/account/sElevenLabsUserResponse";
import "@/types/apiResponse/account/elevenLabs/create";

import { NextRequest } from "next/server";
import { APIResCode } from "@/enums/APIResCode";
/*
import {
    APIAccAddElevenLabsRes,
    xAPIAccAddElevenLabsAPIErrRes,
    xAPIAccAddElevenLabsErrRes,
    xAPIAccAddElevenLabsSuccRes,
} from "@/types/apiResponse/account/elevenLabs/create";
 */

import { mElevenlabsAccount } from "@/lib/db/models/account/mElevenlabsAccount";
import { ObjectId } from "mongodb";
import { xAPIErrRes } from "@/types/apiResponse/xAPIRes";
import { bPoolElevenLabsAddReq } from "./validate";
import { envPromise } from "@/lib/env";

// POST - Add a new account

// export async function POST(request: Request): Promise<NextResponse<ErrorResponse> | NextResponse<SuccessResponse>> {
// export async function POST(req: NextRequest): Promise<xAPIErrRes | xAPISessErrRes | APIAccAddElevenLabsRes> {

const verifyElevenLabsAPIKey = async function verifyElevenLabsAPIKey(apiKey: string) {
    const env = (await envPromise).ret;

    try {
        const elevenLabsRes = await fetch(`${env.ELEVEN_LABS_API_URL}/user`, {
            headers: {
                "xi-api-key": apiKey,
            },
        });

        if (elevenLabsRes.status === 200) {
            elevenLabsResObj = sElevenLabsUserResSchema.parse(await elevenLabsRes.json());
        } else if (elevenLabsRes.status === 401) {
            return new xAPIAccAddElevenLabsAPIErrRes(400, {
                code: ErrorCode.ElevenLabsAPI.INVALID_API_KEY,
                message: "Looks like the API key is invalid, since Elevenlabs returned a 401 status code",
            });
        } else if (elevenLabsRes.status === 422) {
            return new xAPIAccAddElevenLabsAPIErrRes(500, {
                code: ErrorCode.ElevenLabsAPI.UNPROCESSABLE_ENTITY,
                message: "Unprocessable entity err from Elevenlabs",
            });
        } else {
            return new xAPIAccAddElevenLabsAPIErrRes(500, {
                code: ErrorCode.ElevenLabsAPI.UNKNOWN,
                message: "Unknown err from elevenlabs",
            });
        }
    } catch (err) {
        return new xAPIAccAddElevenLabsAPIErrRes(500, {
            code: ErrorCode.ElevenLabsAPI.UNKNOWN,
            message: "Unknown err from elevenlabs",
        });
    }
};

const postHandler = async function (req: bPoolElevenLabsAddReq) {
    const CODE = APIResCode.Error.Account.ElevenLabs.Add;

    try {
        // const service = await new ServiceManager().setup();
        // const cookieManager = service.cookieManager;
        // const cookie = req.cookies.get(cookieManager.name)?.value;
        // const sessionPayload = cookieManager.verify(cookie);
        // const userID = (await sessionPayload).id;

        /*
        const body = await req.json();

        const { apiKey } = validateAPIKey(body);
        const { email } = validateEmail(body);
        const { password } = validatePassword(body);
        */
        const env = (await envPromise).ret;

        const { email, password, apiKey } = req;

        let elevenLabsResObj: tElevenLabsUserRes;

        /*
        TODO: Check for API Key permissions
        +---------------------------+-------------+-------+-------+
        | Endpoint/Feature          | No Access   | Read  | Write |
        +---------------------------+-------------+-------+-------+
        | ENDPOINTS                 |             |       |       |
        +---------------------------+-------------+-------+-------+
        | Text to Speech            | Yes         | Yes   | N/A   |
        | Speech to Speech          | Yes         | Yes   | N/A   |
        | Speech to Text            | Yes         | Yes   | N/A   |
        | Sound Effects             | Yes         | Yes   | N/A   |
        | Audio Isolation           | Yes         | Yes   | N/A   |
        | Voice Generation          | Yes         | Yes   | N/A   |
        | Forced Alignment          | Yes         | Yes   | N/A   |
        | Music Generation          | Yes         | Yes   | N/A   |
        +---------------------------+-------------+-------+-------+
        | RESOURCES                 |             |       |       |
        +---------------------------+-------------+-------+-------+
        | Dubbing                   | Yes         | Yes   | Yes   |
        | ElevenLabs Agents         | Yes         | Yes   | Yes   |
        | Projects                  | Yes         | Yes   | Yes   |
        | Audio Native              | Yes         | Yes   | Yes   |
        | Voices                    | Yes         | Yes   | Yes   |
        +---------------------------+-------------+-------+-------+
        | ADMINISTRATION            |             |       |       |
        +---------------------------+-------------+-------+-------+
        | History                   | Yes         | Yes   | Yes   |
        | Models                    | Yes         | Yes   | Yes   |
        | Pronunciation Dictionaries| Yes         | Yes   | Yes   |
        | User                      | Yes         | Yes   | Yes   |
        | Workspace                 | Yes         | Yes   | Yes   |
        +---------------------------+-------------+-------+-------+

        PERMISSION TYPES:
        - No Access: Cannot use/view the resource
        - Read:      Can view/retrieve the resource
        - Write:     Can create/modify/delete the resource
        - Access:    Can use the endpoint (for API endpoints only)

        NOTE: Some endpoints only have "Access" permission (not Read/Write)
            as they are execution-based rather than resource-based.

        */

        const accountDB = service.mongoDBClient.db("accounts");
        const elevenlabsAccountCollection = accountDB.collection<mElevenlabsAccount>("elevenLabs");

        // Check if account with this id
        const elevenLabsID = elevenLabsResObj.userID;
        const existingAccount = await elevenlabsAccountCollection.findOne({
            _id: elevenLabsResObj.userID,
        });

        if (existingAccount) {
            return new xAPIAccAddElevenLabsErrRes(409, {
                code: ErrorCode.ACCOUNT_ID_ALREADY_EXISTS,
                message: "Account with this elevenlabs id (" + elevenLabsID + ") already exists",
            });
        }

        const account: mElevenlabsAccount = {
            _id: elevenLabsResObj.userID,
            createdByUserID: ObjectId.createFromHexString(userID),
            email,
            password,
            apiKey,
            createdOn: new Date(),
        };

        const result = await elevenlabsAccountCollection.insertOne(account);

        if (!result.acknowledged) {
            return new xAPIErrRes(503, {
                code: APIResCode.Error.DB_ERROR,
                message: "Failed to insert account to database",
            });
        }

        return new xAPIAccAddElevenLabsSuccRes({
            code: APIResCode.SUCCESS,
            message: "Hurray... You just made a contribution",
            data: elevenLabsResObj,
        });
    } catch (err) {
        if (err instanceof xAPIErrRes) {
            return err;
        }

        console.error("Add account error:", err);
        return new xAPIErrRes(500, { code: APIResCode.Error.UNKNOWN_ERROR, message: "Internal server error" });
    }
};
