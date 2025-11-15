import { APIResCode } from "@/enums/APIResCode";
import { Flatten, ValueOf } from "@/lib/enum";

import { NextResponse } from "next/server";
import { APIResponsePhraseMap } from "@/enums/APIResCode";

import type { Delta } from "@/lib/utils";
import { CONSTANT } from "@/constants/constant";

export type iAPIRes = {
    code: ValueOf<Flatten<typeof APIResCode>> & {};
    phrase: keyof Flatten<{ APIResCode: typeof APIResCode }> & {};
    apiInfo: {
        version: string;
        commitSHA: string;
    };
};

export interface iAPIErrRes extends iAPIRes {
    code: ValueOf<Flatten<typeof APIResCode.Error>> & {};
    message: string;
}

export interface iAPISuccRes extends iAPIRes {
    code: typeof APIResCode.SUCCESS;
    message: string;
}

export class xAPIRes<T extends iAPIRes = iAPIRes> extends NextResponse<T> {
    constructor(statusCode: number, headers: [key: string, val: string][], body: Omit<T, "apiInfo" | "phrase">) {
        const resBodyObject: iAPIRes = {
            apiInfo: {
                version: CONSTANT.appInfo.version,
                commitSHA: CONSTANT.appInfo.commitSHA,
            },
            phrase: APIResponsePhraseMap[body["code"]],
            ...body,
        };

        super(JSON.stringify(resBodyObject, null, 4), {
            headers: [["Content-Type", "application/json"], ...headers],
            status: statusCode,
        });
    }
}

export class xAPIErrRes<T extends iAPIErrRes = iAPIErrRes> extends xAPIRes<T> {
    constructor(statusCode: number, body: Delta<iAPIRes, T> & ConstructorParameters<typeof xAPIRes<T>>[2]) {
        super(statusCode, [], body);
    }
}

export class xAPISuccRes<
    T extends iAPISuccRes = iAPISuccRes,
    // Body extends ConstructorParameters<typeof xAPIRes<T>>[2] = ConstructorParameters<typeof xAPIRes<T>>[2],
> extends xAPIRes<T> {
    constructor(
        statusCode: number,
        headers: [key: string, val: string][],
        // body: Omit<Body, "code">,
        body: Delta<iAPIRes, T> & ConstructorParameters<typeof xAPIRes<T>>[2],
    ) {
        // super(statusCode, headers, { code: APIResCode.SUCCESS as (Delta<iAPIErrRes, T> & ConstructorParameters<typeof xAPIRes<T>>[2])["code"], ...body });
        // super(statusCode, headers, { ...body, code: APIResCode.SUCCESS });
        super(statusCode, headers, body);
        // TODO: Fix this typescript err:
        // I don't want to pass the code: APIResCode.SUCCESS in the body (in the constructor)
        // At the type level, I want to Omit it
        // But I am facing an error like this one:

        /*
        type X = {
            code: 0 | 1;
            id: string;
        };

        class Zero<T extends X> {
            constructor(arg0: T) {}
        }

        class One<T extends X & { code: 1 }> extends Zero<T> {
            constructor(arg0: Omit<T, "code">) {
                super({ code: 1, ...arg0 });
            }
        }


        */
    }
}
