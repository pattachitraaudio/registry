import { APIResponseCode } from "@/app/enums/APIResponseCode";

export interface APIResponse {
    status: (typeof APIResponseCode)[keyof typeof APIResponseCode];
}
