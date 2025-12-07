import { NextRequest, NextResponse } from "next/server";
import { tJObject } from "./util";
import { xNextRes } from "./xNextRes";
import { parseReqBodyAsJSONObject } from "./parseReqBodyAsJSONObject";
import { xNoThrowFn, type tAsyncFnReturn, type tNoThrowAsyncFnFilterRet } from "./xNoThrow";
import { iSessionPayload } from "./session";

export type tValidatorFn<RetType extends tJObject = tJObject, ErrType extends {} = {}> = (
    body: tJObject,
) => tAsyncFnReturn<RetType, ErrType>;

export type tHandlerFn<
    ReqType extends tJObject = tJObject,
    RetType extends xNextRes = xNextRes,
    ErrType extends xNextRes = xNextRes,
> = (req: ReqType) => tAsyncFnReturn<RetType, ErrType>;

export type tGetValidatorFnRetType<T extends tValidatorFn> =
    ReturnType<T> extends tAsyncFnReturn<infer RetType, {}> ? RetType : never;

type tGetValidatorFnErrTypeHelper<T extends tValidatorFn> =
    Awaited<ReturnType<T>> extends { err: infer ErrType } ? ErrType : never;

export type tGetValidatorFnErrType<T extends tValidatorFn> = Exclude<tGetValidatorFnErrTypeHelper<T>, null>;

export function createAuthenticatedRoute<
    const ValidatorFnReturnType extends tAsyncFnReturn<ValidatorFnReturnRetType>,
    const HandlerFnReturnType extends ReturnType<tHandlerFn>,
    const ValidatorFnReturnRetType = tNoThrowAsyncFnFilterRet<ValidatorFnReturnType>,
>({
    sessionValidatorFn,
    reqBodyJSONValidatorFn,
    handlerFn,
    reqBodyParserFn,
}: {
    sessionValidatorFn: (req: Request) => tAsyncFnReturn<iSessionPayload>;
    reqBodyJSONValidatorFn: (body: tJObject, sessionPayload: iSessionPayload) => ValidatorFnReturnType;
    handlerFn: (req: ValidatorFnReturnRetType, sessionPayload: iSessionPayload) => HandlerFnReturnType;
    reqBodyParserFn?: (req: Request) => tAsyncFnReturn<tJObject>;
}) {
    const sessionErr = xNextRes.new({
        statusCode: 403,
        body: {
            msg: "You need a valid session cookie",
        },
    } as const);

    async function route(req: NextRequest): Promise<NextResponse> {
        const sessionResult = await sessionValidatorFn(req);

        if (sessionResult.err != null) {
            return sessionErr;
        }

        const sessionPayload = sessionResult.ret;

        if (reqBodyParserFn == null) {
            reqBodyParserFn = parseReqBodyAsJSONObject;
        }

        const bodyJSON = await reqBodyParserFn(req);

        if (bodyJSON.err != null) {
            return xNextRes.new({ statusCode: 400, body: { err: bodyJSON.err } } as const);
        }

        const validatedReqJSON = await reqBodyJSONValidatorFn(bodyJSON.ret, sessionPayload);

        if (validatedReqJSON.err != null) {
            return xNextRes.new({ statusCode: 400, body: { validationErrCode: validatedReqJSON.err } } as const);
        }

        const response = await handlerFn(validatedReqJSON.ret, sessionPayload);

        if (response.err != null) {
            return response.err;
        }

        return response.ret;
    }

    route["handlerFn"] = handlerFn;
    route["isAuthenticated"] = true;
    route["reqBodyJSONValidatorFn"] = reqBodyJSONValidatorFn;
    route["sessionValidatorFn"] = async function () {
        const result = await sessionValidatorFn({} as Request);

        if (result.err != null) {
            return xNoThrowFn.err(sessionErr);
        }

        return xNoThrowFn.ret(result.ret);
    };

    return route;
}
