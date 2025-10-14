import { APIResponseCode } from "@/app/enums/APIResponseCode";
import { SuccessResponse } from "./SuccessResponse";
import { IUser } from "../IUser";

export interface UserResponse extends SuccessResponse {
    status: typeof APIResponseCode.SUCCESS;
    data: IUser;
}
