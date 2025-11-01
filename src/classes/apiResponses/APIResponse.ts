import { NextResponse } from "next/server";
import { APIResponsePhraseMap } from "@/enums/APIResponseCode";

import type { IAPIErrorResponse, IAPISuccessResponse, IAPIResponse } from "@/interfaces/apiResponses/iAPIResponse";

import type { Delta } from "@/lib/utils";
import { CONSTANTS } from "@/constants";

export class APIResponse<T extends IAPIResponse = IAPIResponse> extends NextResponse<T> {
    constructor(statusCode: number, headers: [key: string, val: string][], bodyObject: Omit<T, "apiInfo" | "phrase">) {
        const resBodyObject: IAPIResponse = {
            apiInfo: {
                version: CONSTANTS.appInfo.version,
                commitSHA: CONSTANTS.appInfo.commitSHA,
            },
            phrase: APIResponsePhraseMap[bodyObject["code"]],
            ...bodyObject,
        };

        super(JSON.stringify(resBodyObject, null, 4), {
            headers: [["Content-Type", "application/json"], ...headers],
            status: statusCode,
        });
    }
}

export class APIErrorResponse<T extends IAPIErrorResponse = IAPIErrorResponse> extends APIResponse<T> {
    constructor(
        statusCode: number,
        bodyObject: Delta<IAPIResponse, T> & ConstructorParameters<typeof APIResponse<T>>[2],
    ) {
        super(statusCode, [], bodyObject);
    }
}

export class APISuccessResponse<T extends IAPISuccessResponse = IAPISuccessResponse> extends APIResponse<T> {
    constructor(
        statusCode: number,
        headers: [key: string, val: string][],
        bodyObject: Delta<IAPIResponse, T> & ConstructorParameters<typeof APIResponse<T>>[2],
    ) {
        super(statusCode, headers, bodyObject);
    }
}
