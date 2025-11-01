import { Delta } from "@/lib/utils";
import { APIResponseCode } from "@/enums/APIResponseCode";
import type { IAPIErrorResponse, IAPISuccessResponse } from "@/interfaces/apiResponses/iAPIResponse";
import { APIErrorResponse, APISuccessResponse } from "./APIResponse";

import {
    IAPISignUpErrorResponse,
    IAPISignUpFormErrorResponse,
    IAPISignUpSuccessResponse,
    IAPISignUpFormEmailErrorResponse,
    IAPISignUpFormNameErrorResponse,
    IAPISignUpFormPasswordErrorResponse,
    IAPISignUpFormCaptchaErrorResponse,
} from "@/interfaces/apiResponses/signUp";

/* /signUp */
export class APISignUpSuccessResponse extends APISuccessResponse<IAPISignUpSuccessResponse> {
    constructor(
        bodyObject: Omit<
            Delta<IAPISuccessResponse, IAPISignUpSuccessResponse> & ConstructorParameters<typeof APISuccessResponse>[2],
            "code"
        >,
    ) {
        super(201, [], { ...bodyObject, code: APIResponseCode.SUCCESS });
    }
}

export class APISignUpErrorResponse<
    T extends IAPISignUpErrorResponse = IAPISignUpErrorResponse,
> extends APIErrorResponse<T> {
    constructor(
        statusCode: number,
        bodyObject: Delta<IAPIErrorResponse, T> & ConstructorParameters<typeof APIErrorResponse<T>>[1],
    ) {
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
/* *** *** *** *** */
