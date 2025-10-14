import { APIResponseCode } from "@/app/enums/APIResponseCode";
import { APIResponse } from "./Response";

export interface SuccessResponse extends APIResponse {
    status: typeof APIResponseCode.SUCCESS;
}
