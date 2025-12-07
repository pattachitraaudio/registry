import { Delta } from "@/lib/util";
import type { iAPIErrRes, iAPISuccRes } from "@/types/apiResponse/xAPIRes";
import { xAPIErrRes, xAPISuccRes } from "@/types/apiResponse/xAPIRes";
import { APIResCode } from "@/enums/APIResCode";

// import { iUser } from "../../iUser";
import { iUser } from "@/interfaces/iUser";
import { ValueOf, Flatten } from "@/lib/enum";

/*
export interface IAPILoginSuccessResponse extends iAPISuccRes {
    data: { user: iUser };
}

export interface IAPILoginErrorResponse extends iAPIErrRes {
    code: ValueOf<Flatten<typeof APIResCode.Error.Login>> & {};
}

export interface IAPILoginFormErrorResponse extends IAPILoginErrorResponse {
    code: ValueOf<Flatten<typeof APIResCode.Error.Login.Form>> & {};
}

export interface IAPILoginFormEmailErrorResponse extends IAPILoginFormErrorResponse {
    code: ValueOf<Flatten<typeof APIResCode.Error.Login.Form.Email>> & {};
}

export interface IAPILoginFormPasswordErrorResponse extends IAPILoginFormErrorResponse {
    code: ValueOf<Flatten<typeof APIResCode.Error.Login.Form.Password>> & {};
}

export class APILoginSuccessResponse extends xAPISuccRes<IAPILoginSuccessResponse> {
    constructor(
        headers: [[key: "Set-Cookie", val: string], ...[key: string, val: string][]],
        bodyObject: Omit<
            Delta<iAPISuccRes, IAPILoginSuccessResponse> &
                ConstructorParameters<typeof xAPISuccRes<IAPILoginSuccessResponse>>[2],
            "code"
        >,
    ) {
        super(200, headers, { code: APIResCode.SUCCESS, ...bodyObject });
    }
}

export class APILoginErrorResponse<T extends IAPILoginErrorResponse = IAPILoginErrorResponse> extends xAPIErrRes<T> {
    constructor(
        statusCode: number,
        bodyObject: Delta<iAPIErrRes, IAPILoginErrorResponse> & ConstructorParameters<typeof xAPIErrRes<T>>[1],
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

*/
