import { APIResponseCode } from "@/app/enums/APIResponseCode";
import { SuccessResponse } from "./SuccessResponse";
import { ObjectId } from "mongodb";

export interface SessionResponse extends SuccessResponse {
    status: typeof APIResponseCode.SUCCESS;
    data: {
        id: string;
    };
}
