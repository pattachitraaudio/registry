import {
    IAPISessionErrorResponse,
    IAPISessionJWTErrorResponse,
    IAPISessionSuccessResponse,
} from "@/interfaces/apiResponses/session";
import { APIErrorResponse, APISuccessResponse } from "./APIResponse";
import { IAPIErrorResponse, IAPISuccessResponse } from "@/interfaces/apiResponses/iAPIResponse";
import { Delta } from "@/lib/utils";

export class APISessionErrorResponse<
    T extends IAPISessionErrorResponse = IAPISessionErrorResponse,
> extends APIErrorResponse<T> {
    constructor(
        statusCode: number,
        bodyObject: Delta<IAPIErrorResponse, T> & ConstructorParameters<typeof APIErrorResponse<T>>[1],
    ) {
        super(statusCode, bodyObject);
    }
}

export class APISessionSuccessResponse extends APISuccessResponse<IAPISessionSuccessResponse> {
    constructor(
        bodyObject: Delta<IAPISuccessResponse, IAPISessionSuccessResponse> &
            ConstructorParameters<typeof APISuccessResponse<IAPISessionSuccessResponse>>[2],
    ) {
        super(200, [], bodyObject);
    }
}

export class APISessionJWTErrorResponse<T extends IAPISessionJWTErrorResponse> extends APISessionErrorResponse<T> {
    constructor(
        statusCode: number,
        bodyObject: Delta<IAPISessionErrorResponse, IAPISessionJWTErrorResponse> &
            ConstructorParameters<typeof APISessionErrorResponse<T>>[1],
    ) {
        super(statusCode, bodyObject);
    }
}
