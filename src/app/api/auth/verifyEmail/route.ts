import { ObjectId } from "mongodb";
import { APIResponseCode } from "@/enums/APIResponseCode";
import { APIErrorResponse, APIResponse } from "@/classes/apiResponses/APIResponse";

import {
    APIVerifyEmailVfTokenErrorResponse,
    APIVerifyEmailErrorResponse,
    APIVerifyEmailSuccessResponse,
} from "@/classes/apiResponses/verifyEmail";
import { ServiceManager } from "@/classes/xServiceManager";

function validateToken(bodyObj: object): { vfToken: string } {
    const Code = APIResponseCode.Error.VerifyEmail.VfToken;

    if (!("vfToken" in bodyObj)) {
        throw new APIVerifyEmailVfTokenErrorResponse({
            code: Code.NOT_PRESENT,
            message: "Verification token is required",
        });
    }

    if (typeof bodyObj["vfToken"] !== "string") {
        throw new APIVerifyEmailVfTokenErrorResponse({
            code: Code.NOT_A_STRING,
            message: "Verification token must be of type string",
        });
    }

    const vfToken = bodyObj["vfToken"];

    if (vfToken.length !== 24) {
        throw new APIVerifyEmailVfTokenErrorResponse({
            code: Code.INVALID_LENGTH,
            message: "Verification token must be exactly 24 characters long",
        });
    }

    if (!/^[0-9a-fA-F]+$/.test(vfToken)) {
        throw new APIVerifyEmailVfTokenErrorResponse({
            code: Code.NON_HEX_CHARACTER,
            message: "Verification token must contain only hexadecimal characters",
        });
    }

    return { vfToken };
}

export async function POST(request: Request): Promise<APIResponse> {
    try {
        const Code = APIResponseCode.Error.VerifyEmail;
        const bodyObj = await request.json();
        const { vfToken } = validateToken(bodyObj);

        const id = ObjectId.createFromHexString(vfToken);

        // const emailVfTokens = Globals.mongoDB.emailVerificationTokens();
        const serviceManager = await new ServiceManager().setup();
        const registryDB = serviceManager.mongoDBClient.db("registry");
        const emailVfTokensCollection = registryDB.collection("emailVfTokens");
        const emailVfToken = await emailVfTokensCollection.findOne({ _id: id });

        if (!emailVfToken) {
            return new APIVerifyEmailErrorResponse(404, {
                code: Code.VERIFICATION_TOKEN_NOT_FOUND,
                message: "Verification token not found",
            });
        }

        if (emailVfToken.expiry < new Date()) {
            emailVfTokensCollection.deleteOne({ _id: id });

            return new APIVerifyEmailErrorResponse(410, {
                code: Code.VERIFICATION_TOKEN_EXPIRED,
                message: "Verification token has expired",
            });
        }

        // const users = Globals.mongoDB.users();
        const userCollection = registryDB.collection("users");
        const user = await userCollection.findOne({ _id: emailVfToken.userID });

        if (!user) {
            return new APIVerifyEmailErrorResponse(404, {
                code: Code.USER_NOT_FOUND,

                message: "User not found",
            });
        }

        // TODO: make these two updates a transaction
        await userCollection.updateOne(
            { _id: user._id },
            {
                $set: {
                    isVerified: true,
                },
            },
        );

        await emailVfTokensCollection.deleteOne({ _id: id });

        return new APIVerifyEmailSuccessResponse({
            message: "Email verified successfully",
            data: { user: { name: user.name, email: user.email } },
        });
    } catch (err) {
        if (err instanceof APIVerifyEmailErrorResponse) {
            return err;
        }

        return new APIErrorResponse(500, {
            code: APIResponseCode.Error.UNKNOWN_ERROR,
            message: "Oops, unknown error! please report this to the admin",
        });
    }
}
