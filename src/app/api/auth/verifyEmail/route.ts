import { Binary } from "mongodb";
import { APIResCode } from "@/enums/APIResCode";
import { bVerifyEmailReq, validateVerifyEmailReqBodyJSON } from "./validate";
import { mEmailVfTokenPromise } from "@/repo/mEmailVfToken";
import { xNoThrowFn } from "@/lib/xNoThrow";
import { xNextRes } from "@/lib/xNextRes";
import { mUserPromise } from "@/repo/mUser";
import { dbClientPromise } from "@/lib/db";
import { createRoute } from "@/lib/createRoute";

/*
export async function POST(
    req: NextRequest,
): Promise<APIVerifyEmailSuccessResponse | APIVerifyEmailErrorResponse | xAPIErrRes> {
*/

async function postHandler(req: bVerifyEmailReq) {
    const CODE = APIResCode.Error.VerifyEmail;
    // try {
    const { vfToken } = req;
    const id = Binary.createFromHexString(vfToken);

    const mEmailVfTokenResult = await mEmailVfTokenPromise;

    if (mEmailVfTokenResult.err) {
        return xNoThrowFn.err(xNextRes.newErr({ statusCode: 500, errCode: APIResCode.Error.DB_CONNECTION_FAILED }));
    }

    const mEmailVfToken = mEmailVfTokenResult.ret;

    const emailVfTokenResult = await mEmailVfToken.findOne({ _id: id });

    if (emailVfTokenResult.err != null) {
        return xNoThrowFn.err(xNextRes.newErr({ statusCode: 500, errCode: APIResCode.Error.DB_ERROR }));
    }

    const emailVfToken = emailVfTokenResult.ret;

    if (emailVfToken == null) {
        /*
        return new APIVerifyEmailErrorResponse(404, {
            code: Code.VERIFICATION_TOKEN_NOT_FOUND,
            message: "Verification token not found",
        });
        */

        return xNoThrowFn.err(xNextRes.newErr({ statusCode: 404, errCode: CODE.VERIFICATION_TOKEN_NOT_FOUND_IN_DB }));
    }

    if (emailVfToken.expiry < new Date()) {
        const deleteResult = await mEmailVfToken.deleteOne({ _id: id });

        if (deleteResult.err != null) {
            return xNoThrowFn.err(
                xNextRes.newErr({
                    statusCode: 500,
                    errCode: APIResCode.Error.DB_ERROR,
                }),
            );
        }
        /*
        return new APIVerifyEmailErrorResponse(410, {
            code: Code.VERIFICATION_TOKEN_EXPIRED,
            message: "Verification token has expired",
        });
        */
    }

    // const userCollection = registryDB.collection("users");
    // const user = await userCollection.findOne({ _id: emailVfToken.userID });
    const mUserResult = await mUserPromise;

    if (mUserResult.err != null) {
        return xNoThrowFn.err(xNextRes.newErr({ statusCode: 500, errCode: APIResCode.Error.DB_CONNECTION_FAILED }));
    }

    const mUser = mUserResult.ret;

    const userResult = await mUser.findOne({ _id: emailVfToken.userID });

    if (userResult.err != null) {
        return xNoThrowFn.err(xNextRes.newErr({ statusCode: 500, errCode: APIResCode.Error.DB_ERROR }));
    }

    const user = userResult.ret;

    if (user == null) {
        /*
        return new APIVerifyEmailErrorResponse(404, {
            code: Code.USER_NOT_FOUND,

            message: "User not found",
        });
        */

        return xNoThrowFn.err(
            xNextRes.newErr({
                statusCode: 404,
                errCode: CODE.USER_NOT_FOUND,
            }),
        );
    }

    // const mongoDBSession = mongoDBClient.startSession();
    const dbClientResult = await dbClientPromise;

    if (dbClientResult.err != null) {
        return xNoThrowFn.err(
            xNextRes.newErr({
                statusCode: 500,
                errCode: APIResCode.Error.DB_CONNECTION_FAILED,
            }),
        );
    }

    const dbClient = dbClientResult.ret;
    const dbSession = dbClient.startSession();

    try {
        dbSession.startTransaction();

        const updateResult = await mUser.updateOne(
            { _id: id },
            {
                $set: {
                    isVerified: true,
                },
            },
            { session: dbSession },
        );

        if (updateResult.err != null) {
            return xNoThrowFn.err(xNextRes.newErr({ statusCode: 500, errCode: APIResCode.Error.DB_ERROR }));
            /*
            return xNoThrowFn.err(xNextRes.new(
                {
                    "statusCode": 500,
                    "body": {
                        msg: "Failed to update user's verified status to true"
                    }
                }
            ))
               */
        }

        const deleteResult = await mEmailVfToken.deleteOne({ _id: id }, { session: dbSession });

        if (deleteResult.err != null) {
            /*
            return xNoThrowFn.err(xNextRes.new(

                {
                    "statusCode": 500,
                    "body" : {
                        msg: "Failed to update user's delete status to true"
                    }
                }
            ))
                */
            return xNoThrowFn.err(xNextRes.newErr({ statusCode: 500, errCode: APIResCode.Error.DB_ERROR }));
        }

        await dbSession.commitTransaction();

        /*
        return new APIVerifyEmailSuccessResponse({
            message: "Email verified successfully",
            data: { user: { name: user.name, email: user.email } },
        });
        */
        return xNoThrowFn.ret(xNextRes.new({ statusCode: 200, body: { name: user.name, email: user.email } }));

        // } catch (err) {
        // return xNoThrowFn.ret(xNextRes.new({ statusCode: 500, body: { msg: "Failed to verify user" } }));
    } finally {
        if (dbSession.inTransaction()) {
            await dbSession.abortTransaction();
        }

        await dbSession.endSession();
    }
    /*
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
        */
}

export const POST = createRoute({
    handlerFn: postHandler,
    reqBodyJSONValidatorFn: validateVerifyEmailReqBodyJSON,
});
