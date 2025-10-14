import { APIResponseCode } from "@/app/enums/APIResponseCode";
import { APIResponse } from "./Response";

export interface AccountValidationResponse extends APIResponse {
    status: typeof APIResponseCode.SUCCESS;
    data: {
        userID: string;
        credits: {
            used: number;
            total: number;
        };
    };
}
