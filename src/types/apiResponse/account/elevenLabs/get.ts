import { Delta } from "@/lib/util";
import { iAPIErrRes, iAPISuccRes, xAPIErrRes, xAPISuccRes } from "../../xAPIRes";

export interface iAPIAccGetElevenLabsErrRes extends iAPIErrRes {}

export interface iAPIAccGetElevenLabsSuccRes extends iAPISuccRes {
    data: {
        accounts: { apiKey: string; email: string }[];
    };
}

export class xAPIAccGetElevenLabsErrRes<
    T extends iAPIAccGetElevenLabsErrRes = iAPIAccGetElevenLabsErrRes,
> extends xAPIErrRes<T> {
    constructor(statusCode: number, body: Delta<iAPIErrRes, T> & ConstructorParameters<typeof xAPIErrRes<T>>[1]) {
        super(statusCode, body);
    }
}

export class xAPIAccGetElevenLabsSuccRes<
    T extends iAPIAccGetElevenLabsSuccRes = iAPIAccGetElevenLabsSuccRes,
> extends xAPISuccRes<T> {
    constructor(body: Delta<iAPISuccRes, T> & ConstructorParameters<typeof xAPISuccRes<T>>[2]) {
        super(200, [], body);
    }
}

export type APIAccGetElevenLabsRes = xAPIAccGetElevenLabsErrRes | xAPIAccGetElevenLabsSuccRes;
