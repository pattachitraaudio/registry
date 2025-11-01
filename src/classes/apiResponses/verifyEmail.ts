import { Delta } from "@/lib/utils";

import { APIResponseCode } from "@/enums/APIResponseCode";
import type { IAPIErrorResponse, IAPISuccessResponse } from "@/interfaces/apiResponses/iAPIResponse";

import { APIErrorResponse, APISuccessResponse } from "./APIResponse";

import {
    IAPIVerifyEmailErrorResponse,
    IAPIVerifyEmailSuccessResponse,
    IAPIVerifyEmailVfTokenErrorResponse,
} from "@/interfaces/apiResponses/verifyEmail";

export class APIVerifyEmailSuccessResponse extends APISuccessResponse<IAPIVerifyEmailSuccessResponse> {
    constructor(
        bodyObject: Omit<
            Delta<IAPISuccessResponse, IAPIVerifyEmailSuccessResponse> &
                ConstructorParameters<typeof APISuccessResponse<IAPIVerifyEmailSuccessResponse>>[2],
            "code"
        >,
    ) {
        super(200, [], { ...bodyObject, code: APIResponseCode.SUCCESS });
    }
}

export class APIVerifyEmailErrorResponse<
    T extends IAPIVerifyEmailErrorResponse = IAPIVerifyEmailErrorResponse,
> extends APIErrorResponse<T> {
    constructor(
        statusCode: number,
        bodyObject: Delta<IAPIErrorResponse, IAPIVerifyEmailErrorResponse> &
            ConstructorParameters<typeof APIErrorResponse<T>>[1],
    ) {
        super(statusCode, bodyObject);
    }
}

export class APIVerifyEmailVfTokenErrorResponse extends APIVerifyEmailErrorResponse<IAPIVerifyEmailVfTokenErrorResponse> {
    constructor(
        bodyObject: Delta<IAPIVerifyEmailErrorResponse, IAPIVerifyEmailVfTokenErrorResponse> &
            ConstructorParameters<typeof APIVerifyEmailErrorResponse<IAPIVerifyEmailVfTokenErrorResponse>>[1],
    ) {
        super(400, bodyObject);
    }
}
