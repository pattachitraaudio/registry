import { APIResponseCode } from "@/app/enums/APIResponseCode";
import { ErrorResponse } from "./ErrorResponse";

export interface GenericErrorResponse extends ErrorResponse {
    status: typeof APIResponseCode.GENERIC_ERROR;
}
