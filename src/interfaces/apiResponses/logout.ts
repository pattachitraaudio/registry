import { ValueOf, Flatten } from "@/lib/enum";
import { IUser } from "../IUser";
import { IAPIErrorResponse, IAPISuccessResponse } from "./iAPIResponse";
import { APIResponseCode } from "@/enums/APIResponseCode";

export type IAPILogoutSuccessResponse = IAPISuccessResponse;

export interface IAPILogoutErrorResponse extends IAPIErrorResponse {
    code: ValueOf<Flatten<typeof APIResponseCode.Error.Logout>> & {};
}

// export interface IAPILogout
