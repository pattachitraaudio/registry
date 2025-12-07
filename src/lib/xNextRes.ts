import { NextResponse } from "next/server";
import { tJObject } from "./util";
import { APIResPhraseMap, getErrMessageFromAPIResCode, tAPIResCode } from "@/enums/APIResCode";

const NEXT_RES_SYMBOL = Symbol("NEXT-RES");

// type DecorateRes<tBody, tStatusCode> = { body: tBody; statusCode: tStatusCode };
// type InferFnRetType<FnType extends (...args: readonly any[]) => unknown> = InferRes<Awaited<ReturnType<FnType>>>;
// type InferRes<T> = T extends xNextRes<infer tBody, infer tStatusCode> ? DecorateRes<tBody, tStatusCode> : never;

export class xNextRes<
    const tBody extends tJObject = tJObject,
    const tStatusCode extends number = number,
> extends NextResponse {
    [NEXT_RES_SYMBOL]: {
        body: tBody;
        statusCode: tStatusCode;
    };

    constructor({
        statusCode,
        headers,
        body,
    }: {
        readonly statusCode: tStatusCode;
        readonly headers?: [key: string, val: string][];
        readonly body: tBody;
    }) {
        super(JSON.stringify(body), {
            status: statusCode,
            headers: [["Content-Type", "application/json"], ...(headers ?? [])],
        });

        this[NEXT_RES_SYMBOL] = {
            body: body,
            statusCode: statusCode,
        } as const;
    }

    static new<const Body extends tJObject, const StatusCode extends number>({
        statusCode,
        headers,
        body,
    }: {
        statusCode: StatusCode;
        headers?: [key: string, val: string][];
        body: Body;
    }) {
        return new xNextRes({ headers, body, statusCode } as const);
    }

    static newErr<const StatusCode extends number, const ErrCode extends tAPIResCode>({
        statusCode,
        errCode,
    }: {
        statusCode: StatusCode;
        errCode: ErrCode;
    }) {
        return new xNextRes({
            statusCode: statusCode,
            body: {
                errCode,
                message: getErrMessageFromAPIResCode(errCode),
                phrase: APIResPhraseMap[errCode],
            },
        } as const);
    }
}

/*
class foo<O extends tJObject, T extends number> {
    constructor({ val, object }: { val: T; object: O }) {
        return 0;
    }
}

const x = new foo({ val: 2, object: { id: 1, name: "Romeo" } });

const y = new xNextRes({ statusCode: 2, body: { id: 1, length: 10 } });
const z = xNoThrowFn.ret(y);

const aa = xNoThrowFn.ret(
    xNextRes.new({
        statusCode: 3,
        body: {
            id: 20,
            nested: {
                predicate: true,
                deeper: {
                    deeplyNested: true,
                },
            },
            length: 1,
            height: 12,
        },
    }),
);

*/

/*
function foo() {
    const aa = xNoThrowFn.ret(
        xNextRes.new({
            statusCode: 123456,
            body: {
                id: 20,
                nested: {
                    predicate: true,
                    deeper: {
                        deeplyNested: true,
                    },
                },
                length: 1,
                height: 12,
            },
        }),
    );

    return aa;
}

type T = {
    a: string;
    b: boolean;
    nested: {
        x: number;
        y: number;
        deeper: {
            z: null;
        };
    };
};

const bar = async function bar(t: T) {
    if (Math.random() % 2 == 0) {
        return xNoThrowFn.ret(
            xNextRes.new({
                statusCode: 123456,
                body: {
                    id: 20,
                    nested: {
                        predicate: true,
                        deeper: {
                            deeplyNested: true,
                        },
                    },
                    length: 1,
                    height: 12,
                },
            }),
        );
    }

    return xNoThrowFn.ret(
        xNextRes.new({
            statusCode: 567890,
            body: { string: false },
        }),
    );
} satisfies tHandlerFn<T>;

*/
