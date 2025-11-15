import { Delta } from "@/lib/utils";
import { ValueOf, Flatten } from "@/lib/enum";

import { APIResCode } from "@/enums/APIResCode";
import { xAPIErrRes, xAPISuccRes, iAPIErrRes, iAPISuccRes } from "@/types/apiResponse/xAPIRes";

import { iUser } from "@/interfaces/iUser";

export interface IAPIVerifyEmailErrorResponse extends iAPIErrRes {
    code: ValueOf<Flatten<typeof APIResCode.Error.VerifyEmail>> & {};
}

export interface IAPIVerifyEmailSuccessResponse extends iAPISuccRes {
    code: typeof APIResCode.SUCCESS & {};
    data: {
        user: iUser;
    };
}

export interface IAPIVerifyEmailVfTokenErrorResponse extends IAPIVerifyEmailErrorResponse {
    code: ValueOf<Flatten<typeof APIResCode.Error.VerifyEmail.VfToken>> & {};
}
export class APIVerifyEmailSuccessResponse extends xAPISuccRes<IAPIVerifyEmailSuccessResponse> {
    constructor(
        bodyObject: Omit<
            Delta<iAPISuccRes, IAPIVerifyEmailSuccessResponse> &
                ConstructorParameters<typeof xAPISuccRes<IAPIVerifyEmailSuccessResponse>>[2],
            "code"
        >,
    ) {
        super(200, [], { ...bodyObject, code: APIResCode.SUCCESS });
    }
}

export class APIVerifyEmailErrorResponse<
    T extends IAPIVerifyEmailErrorResponse = IAPIVerifyEmailErrorResponse,
> extends xAPIErrRes<T> {
    constructor(
        statusCode: number,
        bodyObject: Delta<iAPIErrRes, IAPIVerifyEmailErrorResponse> & ConstructorParameters<typeof xAPIErrRes<T>>[1],
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
