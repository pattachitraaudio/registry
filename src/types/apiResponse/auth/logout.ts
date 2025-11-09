import { ValueOf, Flatten } from "@/lib/enum";
import { IUser } from "@/interfaces/iUser";
import { iAPIErrRes, iAPISuccRes } from "../xAPIRes";
import { APIResCode } from "@/enums/APIResCode";

export type IAPILogoutSuccessResponse = iAPISuccRes;

export interface IAPILogoutErrorResponse extends iAPIErrRes {
    code: ValueOf<Flatten<typeof APIResCode.Error.Logout>> & {};
}

// export interface IAPILogout
