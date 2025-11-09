import { APIResCode } from "@/enums/APIResCode";
import { iAPIErrRes, iAPISuccRes, xAPIErrRes, xAPISuccRes } from "@/types/apiResponse/xAPIRes";
import { Flatten, ValueOf } from "@/lib/enum";
import { Delta } from "@/lib/utils";

type AccDeleteErrResCode = typeof APIResCode.Error.Account.ElevenLabs.Delete;

export interface iAPIAccDeleteElevenLabsSuccRes extends iAPISuccRes {
    data: {
        apiKey: string;
    };
}

export interface iAPIAccDeleteElevenLabsErrRes extends iAPIErrRes {
    code: ValueOf<Flatten<AccDeleteErrResCode>>;
}

export interface iAPIAccDeleteElevenLabsParamsErrRes extends iAPIAccDeleteElevenLabsErrRes {
    code: ValueOf<Flatten<AccDeleteErrResCode["Params"]>> & {};
}

export interface iAPIAccDeleteElevenLabsParamsIDErrRes extends iAPIAccDeleteElevenLabsParamsErrRes {
    code: ValueOf<Flatten<AccDeleteErrResCode["Params"]["ID"]>> & {};
}

export class xAPIAccDeleteElevenLabsSuccRes<
    T extends iAPIAccDeleteElevenLabsSuccRes = iAPIAccDeleteElevenLabsSuccRes,
> extends xAPISuccRes {
    constructor(body: Delta<iAPISuccRes, T> & ConstructorParameters<typeof xAPISuccRes<T>>[2]) {
        super(200, [], body);
    }
}

export class xAPIAccDeleteElevenLabsErrRes<
    T extends iAPIAccDeleteElevenLabsErrRes = iAPIAccDeleteElevenLabsErrRes,
> extends xAPIErrRes<T> {
    constructor(statusCode: number, body: Delta<iAPIErrRes, T> & ConstructorParameters<typeof xAPIErrRes<T>>[1]) {
        super(statusCode, body);
    }
}

export class xAPIAccDeleteElevenLabsParamsErrRes<
    T extends iAPIAccDeleteElevenLabsParamsErrRes = iAPIAccDeleteElevenLabsParamsErrRes,
> extends xAPIAccDeleteElevenLabsErrRes<T> {
    constructor(
        statusCode: number,
        body: Delta<iAPIAccDeleteElevenLabsErrRes, T> &
            ConstructorParameters<typeof xAPIAccDeleteElevenLabsErrRes<T>>[1],
    ) {
        super(statusCode, body);
    }
}

export class xAPIAccDeleteElevenLabsParamsIDErrRes<
    T extends iAPIAccDeleteElevenLabsParamsIDErrRes = iAPIAccDeleteElevenLabsParamsIDErrRes,
> extends xAPIAccDeleteElevenLabsParamsErrRes<T> {
    constructor(
        body: Delta<iAPIAccDeleteElevenLabsErrRes, T> &
            ConstructorParameters<typeof xAPIAccDeleteElevenLabsParamsErrRes<T>>[1],
    ) {
        super(400, body);
    }
}

export type APIAccDeleteElevenLabsRes =
    | xAPIAccDeleteElevenLabsErrRes
    | xAPIAccDeleteElevenLabsParamsErrRes
    | xAPIAccDeleteElevenLabsParamsIDErrRes
    | xAPIAccDeleteElevenLabsSuccRes;
