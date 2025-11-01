import { Delta } from "@/lib/utils";
import type { IAPIErrorResponse, IAPISuccessResponse } from "@/interfaces/apiResponses/iAPIResponse";
import { APIErrorResponse, APISuccessResponse } from "./APIResponse";
import {
    IAPILoginErrorResponse,
    IAPILoginFormEmailErrorResponse,
    IAPILoginFormErrorResponse,
    IAPILoginFormPasswordErrorResponse,
    IAPILoginSuccessResponse,
} from "@/interfaces/apiResponses/login";
import { APIResponseCode } from "@/enums/APIResponseCode";

export class APILoginSuccessResponse extends APISuccessResponse<IAPILoginSuccessResponse> {
    constructor(
        headers: [[key: "Set-Cookie", val: string], ...[key: string, val: string][]],
        bodyObject: Omit<
            Delta<IAPISuccessResponse, IAPILoginSuccessResponse> &
                ConstructorParameters<typeof APISuccessResponse<IAPILoginSuccessResponse>>[2],
            "code"
        >,
    ) {
        super(200, headers, { code: APIResponseCode.SUCCESS, ...bodyObject });
    }
}

export class APILoginErrorResponse<
    T extends IAPILoginErrorResponse = IAPILoginErrorResponse,
> extends APIErrorResponse<T> {
    constructor(
        statusCode: number,
        bodyObject: Delta<IAPIErrorResponse, IAPILoginErrorResponse> &
            ConstructorParameters<typeof APIErrorResponse<T>>[1],
    ) {
        super(statusCode, bodyObject);
    }
}

export class APILoginFormErrorResponse<T extends IAPILoginFormErrorResponse> extends APILoginErrorResponse<T> {
    constructor(
        bodyObject: Delta<IAPILoginErrorResponse, IAPILoginFormErrorResponse> &
            ConstructorParameters<typeof APILoginErrorResponse<T>>[1],
    ) {
        super(400, bodyObject);
    }
}

export class APILoginFormEmailErrorResponse extends APILoginFormErrorResponse<IAPILoginFormEmailErrorResponse> {
    constructor(
        bodyObject: Delta<IAPILoginFormErrorResponse, IAPILoginFormEmailErrorResponse> &
            ConstructorParameters<typeof APILoginFormErrorResponse<IAPILoginFormEmailErrorResponse>>[0],
    ) {
        super(bodyObject);
    }
}

export class APILoginFormPasswordErrorResponse extends APILoginFormErrorResponse<IAPILoginFormPasswordErrorResponse> {
    constructor(
        bodyObject: Delta<IAPILoginFormErrorResponse, IAPILoginFormPasswordErrorResponse> &
            ConstructorParameters<typeof APILoginFormErrorResponse<IAPILoginFormPasswordErrorResponse>>[0],
    ) {
        super(bodyObject);
    }
}
