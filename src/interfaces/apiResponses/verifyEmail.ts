import { IAPIErrorResponse, IAPISuccessResponse } from "./iAPIResponse";
import { ValueOf, Flatten } from "@/lib/enum";
import { APIResponseCode } from "@/enums/APIResponseCode";
import { IUser } from "../IUser";

export interface IAPIVerifyEmailErrorResponse extends IAPIErrorResponse {
    code: ValueOf<Flatten<typeof APIResponseCode.Error.VerifyEmail>> & {};
}

export interface IAPIVerifyEmailSuccessResponse extends IAPISuccessResponse {
    code: typeof APIResponseCode.SUCCESS & {};
    data: {
        user: IUser;
    };
}

export interface IAPIVerifyEmailVfTokenErrorResponse extends IAPIVerifyEmailErrorResponse {
    code: ValueOf<Flatten<typeof APIResponseCode.Error.VerifyEmail.VfToken>> & {};
}
