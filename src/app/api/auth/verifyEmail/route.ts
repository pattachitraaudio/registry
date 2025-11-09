import { ObjectId } from "mongodb";
import { APIResCode } from "@/enums/APIResCode";
import { xAPIErrRes } from "@/types/apiResponse/xAPIRes";
import {
    APIVerifyEmailVfTokenErrorResponse,
    APIVerifyEmailErrorResponse,
    APIVerifyEmailSuccessResponse,
} from "@/types/apiResponse/auth/verifyEmail";
import { ServiceManager } from "@/classes/xServiceManager";
import { NextRequest } from "next/server";

function validateToken(bodyObj: object): { vfToken: string } {
    const Code = APIResCode.Error.VerifyEmail.VfToken;

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

export async function POST(
    req: NextRequest,
): Promise<APIVerifyEmailSuccessResponse | APIVerifyEmailErrorResponse | xAPIErrRes> {
    try {
        const Code = APIResCode.Error.VerifyEmail;
        const bodyObj = await req.json();
        const { vfToken } = validateToken(bodyObj);

        const id = ObjectId.createFromHexString(vfToken);

        const serviceManager = await new ServiceManager().setup();
        const mongoDBClient = serviceManager.mongoDBClient;
        const registryDB = mongoDBClient.db("registry");
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

        const userCollection = registryDB.collection("users");
        const user = await userCollection.findOne({ _id: emailVfToken.userID });

        if (!user) {
            return new APIVerifyEmailErrorResponse(404, {
                code: Code.USER_NOT_FOUND,

                message: "User not found",
            });
        }

        const mongoDBSession = mongoDBClient.startSession();

        try {
            mongoDBSession.startTransaction();

            await userCollection.updateOne(
                { _id: user._id },
                {
                    $set: {
                        isVerified: true,
                    },
                },
                { session: mongoDBSession },
            );
            await emailVfTokensCollection.deleteOne({ _id: id }, { session: mongoDBSession });

            mongoDBSession.commitTransaction();

            return new APIVerifyEmailSuccessResponse({
                message: "Email verified successfully",
                data: { user: { name: user.name, email: user.email } },
            });
        } catch (err) {
            mongoDBSession.abortTransaction();
            throw err;
        } finally {
            mongoDBSession.endSession();
        }
    } catch (err) {
        if (err instanceof APIVerifyEmailErrorResponse) {
            return err;
        }

        console.log(err, JSON.stringify(err));

        return new xAPIErrRes(500, {
            code: APIResCode.Error.UNKNOWN_ERROR,
            message: "Oops, unknown error! please report this to the admin",
        });
    }
}
