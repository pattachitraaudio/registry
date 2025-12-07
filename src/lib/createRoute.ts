import { NextRequest, NextResponse } from "next/server";
import { tJObject } from "./util";
import { xNextRes } from "./xNextRes";
import { parseReqBodyAsJSONObject } from "./parseReqBodyAsJSONObject";
import type { tAsyncFnReturn, tNoThrowAsyncFnFilterRet } from "./xNoThrow";

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

export function createRoute<
    const ValidatorFnReturnType extends tAsyncFnReturn<ValidatorFnReturnRetType>,
    const HandlerFnReturnType extends ReturnType<tHandlerFn>,
    const ValidatorFnReturnRetType = tNoThrowAsyncFnFilterRet<ValidatorFnReturnType>,
>({
    // reqBodyJSONValidatorFn,
    reqBodyJSONValidatorFn,
    handlerFn,
    reqBodyParserFn,
}: {
    reqBodyJSONValidatorFn: (body: tJObject) => ValidatorFnReturnType;
    handlerFn: (req: ValidatorFnReturnRetType) => HandlerFnReturnType;
    reqBodyParserFn?: (req: Request) => tAsyncFnReturn<tJObject>;
}) {
    async function route(req: NextRequest): Promise<NextResponse> {
        if (reqBodyParserFn == null) {
            reqBodyParserFn = parseReqBodyAsJSONObject;
        }

        const bodyJSON = await reqBodyParserFn(req);

        if (bodyJSON.err != null) {
            return xNextRes.new({ statusCode: 400, body: { err: bodyJSON.err } });
        }

        const validatedReqJSON = await reqBodyJSONValidatorFn(bodyJSON.ret);

        if (validatedReqJSON.err != null) {
            return xNextRes.new({ statusCode: 400, body: { validationErrCode: validatedReqJSON.err } });
        }

        const response = await handlerFn(validatedReqJSON.ret);

        if (response.err != null) {
            return response.err;
        }

        return response.ret;
    }

    route["handlerFn"] = handlerFn;
    route["reqBodyJSONValidatorFn"] = reqBodyJSONValidatorFn;

    return route;
}
