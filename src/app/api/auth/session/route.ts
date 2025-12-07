// import { NextRequest } from "next/server";
import { APIResCode } from "@/enums/APIResCode";
// import { ObjectId } from "mongodb";

// import { xAPISessSuccRes, xAPISessErrRes, tAPISessRes } from "@/types/apiResponse/auth/session";

// import { xAPIErrRes } from "@/types/apiResponse/xAPIRes";
import { iSessionPayload } from "@/lib/session";
import { bSessionReq, validateSessionReqBodyJSON } from "./validator";
import { createAuthenticatedRoute } from "@/lib/createAuthenticatedRoute";
import { validateSession } from "@/lib/validateSession";
import { xNoThrowFn } from "@/lib/xNoThrow";
import { xNextRes } from "@/lib/xNextRes";

// export async function GET(req: NextRequest): Promise<tAPISessRes> {

const getHandler = async function (req: bSessionReq, sessionPayload: iSessionPayload) {
    const CODE = APIResCode.Error.Session;
    // const service = await new ServiceManager().setup();
    // const cookieManager = service.cookieManager;

    // try {
    // const sessionPayload = await cookieManager.verify(req.cookies.get(cookieManager.name)?.value);
    // const db = service.mongoDBClient.db("registry");
    // const cookieResult = (await sessionPromise).ret;

    return xNoThrowFn.ret(
        xNextRes.new({
            statusCode: 200,
            body: sessionPayload,
        }),
    );

    // const userCollection = db.collection<mUser>("users");
    // const user = await userCollection.findOne({ _id: ObjectId.createFromHexString(sessionPayload.id) });

    // if (!user) {
    /*
        return new xAPISessErrRes(404, {
            code: Code.USER_NOT_FOUND,
            message: "User not found",
        });
        */
    // }

    /*
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
    */
    /*
    } catch (err) {
        if (err instanceof xAPIErrRes) {
            return err;
        }

        return new xAPIErrRes(500, {
            code: APIResCode.Error.UNKNOWN_ERROR,
            message: "whoa! that's an unknown err in the /session route",
        });
    }
        */
};

export const GET = createAuthenticatedRoute({
    sessionValidatorFn: validateSession,
    handlerFn: getHandler,
    reqBodyJSONValidatorFn: validateSessionReqBodyJSON,
});

/*
Type '(req: Request) => Promise<{ err: xNextRes<{ msg: string; }, 403>; } | tNoThrowRet<xNextRes<{ id: string; name: string; email: string; referredBy: string; referralCode: string; }, 200>>>' is not assignable to type '(req: Request) => tAsyncFnReturn<iSessionPayload, xNextRes<tJObject, number>>'.
  Type 'Promise<{ err: xNextRes<{ msg: string; }, 403>; } | tNoThrowRet<xNextRes<{ id: string; name: string; email: string; referredBy: string; referralCode: string; }, 200>>>' is not assignable to type 'tAsyncFnReturn<iSessionPayload, xNextRes<tJObject, number>>'.
    Type '{ err: xNextRes<{ msg: string; }, 403>; } | tNoThrowRet<xNextRes<{ id: string; name: string; email: string; referredBy: string; referralCode: string; }, 200>>' is not assignable to type 'tFnReturn<iSessionPayload, xNextRes<tJObject, number>>'.
      Type 'tNoThrowRet<xNextRes<{ id: string; name: string; email: string; referredBy: string; referralCode: string; }, 200>>' is not assignable to type 'tFnReturn<iSessionPayload, xNextRes<tJObject, number>>'.
        Type 'tNoThrowRet<xNextRes<{ id: string; name: string; email: string; referredBy: string; referralCode: string; }, 200>>' is not assignable to type 'tNoThrowRet<iSessionPayload>'.
          Type 'xNextRes<{ id: string; name: string; email: string; referredBy: string; referralCode: string; }, 200>' is missing the following properties from type 'iSessionPayload': name, email, id, referredBy, referralCode
          */
