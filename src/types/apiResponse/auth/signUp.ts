import { Delta } from "@/lib/utils";
import { APIResCode } from "@/enums/APIResCode";
import type { iAPIErrRes, iAPISuccRes } from "@/types/apiResponse/xAPIRes";
import { xAPIErrRes, xAPISuccRes } from "@/types/apiResponse/xAPIRes";

import { ValueOf, Flatten } from "@/lib/enum";
import { IUser } from "@/interfaces/iUser";

export interface IAPISignUpErrorResponse extends iAPIErrRes {
    code: ValueOf<Flatten<typeof APIResCode.Error.SignUp>>;
}

export interface IAPISignUpSuccessResponse extends iAPISuccRes {
    data: { user: IUser };
}

export interface IAPISignUpFormErrorResponse extends IAPISignUpErrorResponse {
    code: ValueOf<Flatten<typeof APIResCode.Error.SignUp.Form>>;
}

export interface IAPISignUpFormEmailErrorResponse extends IAPISignUpErrorResponse {
    code: ValueOf<Flatten<typeof APIResCode.Error.SignUp.Form.Email>>;
}

export interface IAPISignUpFormNameErrorResponse extends IAPISignUpErrorResponse {
    code: ValueOf<Flatten<typeof APIResCode.Error.SignUp.Form.Name>>;
}

export interface IAPISignUpFormPasswordErrorResponse extends IAPISignUpErrorResponse {
    code: ValueOf<Flatten<typeof APIResCode.Error.SignUp.Form.Password>>;
}

export interface IAPISignUpFormCaptchaErrorResponse extends IAPISignUpErrorResponse {
    code: ValueOf<Flatten<typeof APIResCode.Error.SignUp.Form.ReferralCode>>;
}
/* /signUp */
export class APISignUpSuccessResponse extends xAPISuccRes<IAPISignUpSuccessResponse> {
    constructor(
        bodyObject: Omit<
            Delta<iAPISuccRes, IAPISignUpSuccessResponse> & ConstructorParameters<typeof xAPISuccRes>[2],
            "code"
        >,
    ) {
        super(201, [], { ...bodyObject, code: APIResCode.SUCCESS });
    }
}

export class APISignUpErrorResponse<T extends IAPISignUpErrorResponse = IAPISignUpErrorResponse> extends xAPIErrRes<T> {
    constructor(statusCode: number, bodyObject: Delta<iAPIErrRes, T> & ConstructorParameters<typeof xAPIErrRes<T>>[1]) {
        super(statusCode, bodyObject);
    }
}

export class APISignUpFormErrorResponse<
    T extends IAPISignUpFormErrorResponse = IAPISignUpFormErrorResponse,
> extends APISignUpErrorResponse<T> {
    constructor(
        bodyObject: Delta<IAPISignUpErrorResponse, T> & ConstructorParameters<typeof APISignUpErrorResponse<T>>[1],
    ) {
        super(400, bodyObject);
    }
}

export class APISignUpFormEmailErrorResponse<
    T extends IAPISignUpFormEmailErrorResponse,
> extends APISignUpFormErrorResponse<T> {
    constructor(
        bodyObject: Delta<IAPISignUpFormErrorResponse, T> &
            ConstructorParameters<typeof APISignUpFormErrorResponse<T>>[0],
    ) {
        super(bodyObject);
    }
}

export class APISignUpFormNameErrorResponse<
    T extends IAPISignUpFormNameErrorResponse,
> extends APISignUpFormErrorResponse<T> {
    constructor(
        bodyObject: Delta<IAPISignUpFormErrorResponse, T> &
            ConstructorParameters<typeof APISignUpFormErrorResponse<T>>[0],
    ) {
        super(bodyObject);
    }
}

export class APISignUpFormPasswordErrorResponse<
    T extends IAPISignUpFormPasswordErrorResponse,
> extends APISignUpFormErrorResponse<T> {
    constructor(
        bodyObject: Delta<IAPISignUpFormErrorResponse, IAPISignUpFormPasswordErrorResponse> &
            ConstructorParameters<typeof APISignUpFormErrorResponse<T>>[0],
    ) {
        super(bodyObject);
    }
}

export class APISignUpFormReferralCodeErrorResponse<
    T extends IAPISignUpFormCaptchaErrorResponse,
> extends APISignUpFormErrorResponse<T> {
    constructor(
        bodyObject: Delta<IAPISignUpFormErrorResponse, IAPISignUpFormCaptchaErrorResponse> &
            ConstructorParameters<typeof APISignUpFormErrorResponse<T>>[0],
    ) {
        super(bodyObject);
    }
}
