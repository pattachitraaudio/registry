import { APIResponseCode } from "@/app/enums/APIResponseCode";
import { SuccessResponse } from "./SuccessResponse";
import { IAccount } from "../IAccount";

export interface AccountsResponse extends SuccessResponse {
    status: typeof APIResponseCode.SUCCESS;
    data: {
        accounts: IAccount[];
    };
}
