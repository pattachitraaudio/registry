import { ServiceManager } from "@/classes/xServiceManager";
import { tElevenLabsUserRes } from "@/schemas/account/sElevenLabsUserResponse";
import "@/types/apiResponse/account/elevenLabs/create";

import { NextRequest, NextResponse } from "next/server";
import { APIResCode } from "@/enums/APIResCode";
import {
    APIAccCreateElevenLabsRes,
    xAPIAccCreateElevenLabsAPIErrRes,
    xAPIAccCreateElevenLabsErrRes,
    xAPIAccCreateElevenLabsFormAPIKeyErrRes,
    xAPIAccCreateElevenLabsFormEmailErrRes,
    xAPIAccCreateElevenLabsFormPassErrRes,
    xAPIAccCreateElevenLabsSuccRes,
} from "@/types/apiResponse/account/elevenLabs/create";

import { mElevenlabsAccount } from "@/models/account/mElevenlabsAccount";
import { ObjectId } from "mongodb";
import { xAPIErrRes } from "@/types/apiResponse/xAPIRes";
import { xAPISessErrRes } from "@/types/apiResponse/auth/session";

// POST - Add a new account

function validateAPIKey(bodyObj: object): { apiKey: string } {
    const Code = APIResCode.Error.Account.ElevenLabs.Create.Form.APIKey;
    // example: sk_6f2faec1f02da9c79121ac5f1554cba22719ca158f32b292

    if (!("apiKey" in bodyObj)) {
        throw new xAPIAccCreateElevenLabsFormAPIKeyErrRes({
            code: Code.NOT_PRESENT,
            message: "API Key not present",
        });
    }

    const apiKey = bodyObj.apiKey;

    if (typeof apiKey !== "string") {
        throw new xAPIAccCreateElevenLabsFormAPIKeyErrRes({
            code: Code.NOT_A_STRING,
            message: "API Key must be a string",
        });
    }

    if (!apiKey.startsWith("sk_")) {
        throw new xAPIAccCreateElevenLabsFormAPIKeyErrRes({
            code: Code.INVALID_PREFIX,
            message: "API Key must start with 'sk_'",
        });
    }

    if (apiKey.length !== 51) {
        // sk_ (3 chars) + 48 hex chars = 51 total
        throw new xAPIAccCreateElevenLabsFormAPIKeyErrRes({
            code: Code.INVALID_LENGTH,
            message: "API Key must be exactly 51 characters (sk_ + 48 hex characters)",
        });
    }

    const hexPart = apiKey.slice(3); // Get everything after "sk_"
    if (!hexPart.match(/^[a-f0-9]{48}$/)) {
        throw new xAPIAccCreateElevenLabsFormAPIKeyErrRes({
            code: Code.INVALID_FORMAT,
            message: "API Key must contain only lowercase hexadecimal characters (a-f, 0-9) after 'sk_'",
        });
    }

    return { apiKey };
}

function validateEmail(bodyObj: object): { email: string } {
    const Code = APIResCode.Error.Account.ElevenLabs.Create.Form.Email;

    if (!("email" in bodyObj)) {
        throw new xAPIAccCreateElevenLabsFormEmailErrRes({
            code: Code.NOT_PRESENT,
            message: "Email not present",
        });
    }

    const email = bodyObj.email;

    if (typeof email !== "string") {
        throw new xAPIAccCreateElevenLabsFormEmailErrRes({
            code: Code.NOT_A_STRING,
            message: "Email must be a string",
        });
    }

    if (!email.match(/^[a-z0-9]+@/)) {
        throw new xAPIAccCreateElevenLabsFormEmailErrRes({
            code: Code.INVALID_USERNAME,
            message:
                "Email username must contain only letters and numbers (no dots, underscores, or special characters)",
        });
    }

    if (!email.match(/@[a-z0-9]+\./)) {
        throw new xAPIAccCreateElevenLabsFormEmailErrRes({
            code: Code.INVALID_DOMAIN_NAME,
            message: "Email domain must contain only letters and numbers (no underscores or special characters)",
        });
    }

    if (!email.match(/^[^.]*@[^.]*\.[^.]*$/)) {
        throw new xAPIAccCreateElevenLabsFormEmailErrRes({
            code: Code.INVALID_DOMAIN_NAME,
            message: "Email must not contain subdomains (format: username@domain.tld)",
        });
    }

    if (!email.match(/^[a-z0-9]+@[a-z0-9]+\.[a-z]{2,}$/)) {
        throw new xAPIAccCreateElevenLabsFormEmailErrRes({
            code: Code.FAILED_TO_VALIDATE_EMAIL,
            message: "Invalid email address",
        });
    }

    return { email };
}

function validatePassword(bodyObj: object): { password: string } {
    const Code = APIResCode.Error.Account.ElevenLabs.Create.Form.Password;

    if (!("password" in bodyObj)) {
        throw new xAPIAccCreateElevenLabsFormPassErrRes({
            code: Code.NOT_PRESENT,
            message: "Password not present",
        });
    }

    const password = bodyObj.password;

    if (typeof password !== "string") {
        throw new xAPIAccCreateElevenLabsFormPassErrRes({
            code: Code.NOT_A_STRING,
            message: "Password must be a string",
        });
    }

    if (password.length < 8) {
        throw new xAPIAccCreateElevenLabsFormPassErrRes({
            code: Code.TOO_SHORT,
            message: "Password must be at least 8 characters long",
        });
    }

    if (password.length > 128) {
        throw new xAPIAccCreateElevenLabsFormPassErrRes({
            code: Code.TOO_LONG,
            message: "Password must not exceed 128 characters",
        });
    }

    if (!password.match(/[a-z]/)) {
        throw new xAPIAccCreateElevenLabsFormPassErrRes({
            code: Code.MISSING_LOWERCASE,
            message: "Password must contain at least one lowercase letter",
        });
    }

    if (!password.match(/[A-Z]/)) {
        throw new xAPIAccCreateElevenLabsFormPassErrRes({
            code: Code.MISSING_UPPERCASE,
            message: "Password must contain at least one uppercase letter",
        });
    }

    if (!password.match(/[0-9]/)) {
        throw new xAPIAccCreateElevenLabsFormPassErrRes({
            code: Code.MISSING_NUMBER,
            message: "Password must contain at least one number",
        });
    }

    if (!password.match(/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/)) {
        throw new xAPIAccCreateElevenLabsFormPassErrRes({
            code: Code.MISSING_SPECIAL_CHARACTER,
            message: "Password must contain at least one special character",
        });
    }

    return { password };
}

// export async function POST(request: Request): Promise<NextResponse<ErrorResponse> | NextResponse<SuccessResponse>> {
export async function POST(req: NextRequest): Promise<xAPIErrRes | xAPISessErrRes | APIAccCreateElevenLabsRes> {
    const ErrorCode = APIResCode.Error.Account.ElevenLabs.Create;
    try {
        const cookieManager = (await new ServiceManager().setup()).cookieManager;
        const cookie = req.cookies.get(cookieManager.name)?.value;
        const sessionPayload = cookieManager.verify(cookie);
        const userID = (await sessionPayload).id;

        const bodyObj = await req.json();

        const { apiKey } = validateAPIKey(bodyObj);
        const { email } = validateEmail(bodyObj);
        const { password } = validatePassword(bodyObj);

        let elevenLabsResObj: tElevenLabsUserRes;

        try {
            const elevenLabsRes = await fetch("https://api.elevenlabs.io/v1/user", {
                headers: {
                    "xi-api-key": apiKey,
                },
            });

            if (elevenLabsRes.status === 200) {
                elevenLabsResObj = (await elevenLabsRes.json()) as tElevenLabsUserRes;
            } else if (elevenLabsRes.status === 401) {
                return new xAPIAccCreateElevenLabsAPIErrRes(400, {
                    code: ErrorCode.ElevenLabsAPI.INVALID_API_KEY,
                    message: "Looks like the API key is invalid, since Elevenlabs returned a 401 status code",
                });
            } else if (elevenLabsRes.status === 422) {
                return new xAPIAccCreateElevenLabsAPIErrRes(500, {
                    code: ErrorCode.ElevenLabsAPI.UNPROCESSABLE_ENTITY,
                    message: "Unprocessable entity err from Elevenlabs",
                });
            } else {
                return new xAPIAccCreateElevenLabsAPIErrRes(500, {
                    code: ErrorCode.ElevenLabsAPI.UNKNOWN,
                    message: "Unknown err from elevenlabs",
                });
            }
        } catch (err) {
            return new xAPIAccCreateElevenLabsAPIErrRes(500, {
                code: ErrorCode.ElevenLabsAPI.UNKNOWN,
                message: "Unknown err from elevenlabs",
            });
        }

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

        const service = await new ServiceManager().setup();
        const accountDB = service.mongoDBClient.db("accounts");
        const elevenlabsAccountCollection = accountDB.collection<mElevenlabsAccount>("elevenLabs");

        // Check if account with this id
        const elevenLabsID = elevenLabsResObj.userID;
        const existingAccount = await elevenlabsAccountCollection.findOne({
            _id: elevenLabsResObj.userID,
        });

        if (existingAccount) {
            return new xAPIAccCreateElevenLabsErrRes(409, {
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

        return new xAPIAccCreateElevenLabsSuccRes({
            code: APIResCode.SUCCESS,
            message: "Hurray... You just made a contribution",
            data: elevenLabsResObj,
        });
    } catch (err) {
        console.error("Add account error:", err);
        return new xAPIErrRes(500, { code: APIResCode.Error.UNKNOWN_ERROR, message: "Internal server error" });
    }
}
