import { APIResponseCode } from "@/app/enums/APIResponseCode";
import { APIResponse } from "./Response";

type ValueOf<T extends object> = T[keyof T];

export interface ErrorResponse extends APIResponse {
    status: typeof APIResponseCode.GENERIC_ERROR | ValueOf<typeof APIResponseCode.SessionError>;
    message: string;
}
