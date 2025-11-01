import { APIResponseCode } from "@/enums/APIResponseCode";
import { IUser } from "../IUser";
import { IAPIErrorResponse, IAPISuccessResponse } from "./iAPIResponse";
import { ValueOf, Flatten } from "@/lib/enum";

export interface IAPILoginSuccessResponse extends IAPISuccessResponse {
    data: { user: IUser };
}

export interface IAPILoginErrorResponse extends IAPIErrorResponse {
    code: ValueOf<Flatten<typeof APIResponseCode.Error.Login>> & {};
}

export interface IAPILoginFormErrorResponse extends IAPILoginErrorResponse {
    code: ValueOf<Flatten<typeof APIResponseCode.Error.Login.Form>> & {};
}

export interface IAPILoginFormEmailErrorResponse extends IAPILoginFormErrorResponse {
    code: ValueOf<Flatten<typeof APIResponseCode.Error.Login.Form.Email>> & {};
}

export interface IAPILoginFormPasswordErrorResponse extends IAPILoginFormErrorResponse {
    code: ValueOf<Flatten<typeof APIResponseCode.Error.Login.Form.Password>> & {};
}
