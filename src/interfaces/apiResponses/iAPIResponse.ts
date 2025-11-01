import { APIResponseCode } from "@/enums/APIResponseCode";
import { Flatten, ValueOf } from "@/lib/enum";

export type IAPIResponse = {
    apiInfo: {
        version: string;
        commitSHA: string;
    };
    code: ValueOf<Flatten<typeof APIResponseCode>> & {};
    phrase: keyof Flatten<{ APIResponseCode: typeof APIResponseCode }> & {};
};

export interface IAPIErrorResponse extends IAPIResponse {
    code: ValueOf<Flatten<typeof APIResponseCode.Error>> & {};
    message: string;
}

export interface IAPISuccessResponse extends IAPIResponse {
    code: typeof APIResponseCode.SUCCESS;
    message: string;
}
