import { Flatten, ValueOf } from "@/lib/enum";
import { IAPIErrorResponse, IAPISuccessResponse } from "./iAPIResponse";
import { APIResponseCode } from "@/enums/APIResponseCode";
import { IUser } from "../IUser";

export interface IAPISessionErrorResponse extends IAPIErrorResponse {
    code: ValueOf<Flatten<typeof APIResponseCode.Error.Session>>;
}

export interface IAPISessionSuccessResponse extends IAPISuccessResponse {
    code: typeof APIResponseCode.SUCCESS;
    data: {
        user: IUser;
    };
}

export interface IAPISessionJWTErrorResponse extends IAPISessionErrorResponse {
    code: ValueOf<Flatten<typeof APIResponseCode.Error.Session.JWT>>;
}
