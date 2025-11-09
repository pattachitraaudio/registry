import { APIResCode } from "@/enums/APIResCode";
import { iAPIErrRes, iAPISuccRes, xAPIErrRes, xAPISuccRes } from "@/types/apiResponse/xAPIRes";
import { Flatten, ValueOf } from "@/lib/enum";
import { Delta } from "@/lib/utils";
import { tElevenLabsUserRes } from "@/schemas/account/sElevenLabsUserResponse";

type AccCreateResCode = typeof APIResCode.Error.Account.ElevenLabs.Create;

export interface iAPIAccCreateElevenLabsSuccRes extends iAPISuccRes {
    data: tElevenLabsUserRes;
}

export interface iAPIAccCreateElevenLabsErrRes extends iAPIErrRes {
    code: ValueOf<Flatten<AccCreateResCode>>;
}

type AccCreateFormErrResCode = AccCreateResCode["Form"];

export interface iAPIAccCreateElevenLabsFormErrRes extends iAPIAccCreateElevenLabsErrRes {
    code: ValueOf<Flatten<AccCreateFormErrResCode>>;
}

export interface iAPIAccCreateElevenLabsFormEmailErrRes extends iAPIAccCreateElevenLabsFormErrRes {
    code: ValueOf<Flatten<AccCreateFormErrResCode["Email"]>>;
}

export interface iAPIAccCreateElevenLabsFormPassErrRes extends iAPIAccCreateElevenLabsFormErrRes {
    code: ValueOf<Flatten<AccCreateFormErrResCode["Password"]>>;
}

export interface iAPIAccCreateElevenLabsFormAPIKeyErrRes extends iAPIAccCreateElevenLabsFormErrRes {
    code: ValueOf<Flatten<AccCreateFormErrResCode["APIKey"]>>;
}

export interface iAPIAccCreateElevenLabsAPIErrRes extends iAPIAccCreateElevenLabsErrRes {}

export class xAPIAccCreateElevenLabsSuccRes<
    T extends iAPIAccCreateElevenLabsSuccRes = iAPIAccCreateElevenLabsSuccRes,
> extends xAPISuccRes<T> {
    constructor(body: Delta<iAPISuccRes, T> & ConstructorParameters<typeof xAPISuccRes<T>>[2]) {
        super(201, [], body);
    }
}

export class xAPIAccCreateElevenLabsErrRes<
    T extends iAPIAccCreateElevenLabsErrRes = iAPIAccCreateElevenLabsErrRes,
> extends xAPIErrRes<T> {
    constructor(
        statusCode: number,
        body: Delta<iAPIErrRes, iAPIAccCreateElevenLabsErrRes> & ConstructorParameters<typeof xAPIErrRes<T>>[1],
    ) {
        super(statusCode, body);
    }
}

export class xAPIAccCreateElevenLabsFormErrRes<
    T extends iAPIAccCreateElevenLabsFormErrRes = iAPIAccCreateElevenLabsFormErrRes,
> extends xAPIAccCreateElevenLabsErrRes<T> {
    constructor(
        bodyObject: Delta<iAPIErrRes, iAPIAccCreateElevenLabsFormErrRes> &
            ConstructorParameters<typeof xAPIAccCreateElevenLabsErrRes<T>>[1],
    ) {
        super(400, bodyObject);
    }
}

export class xAPIAccCreateElevenLabsFormEmailErrRes<
    T extends iAPIAccCreateElevenLabsFormEmailErrRes = iAPIAccCreateElevenLabsFormEmailErrRes,
> extends xAPIAccCreateElevenLabsFormErrRes<T> {
    constructor(
        bodyObject: Delta<iAPIAccCreateElevenLabsFormErrRes, iAPIAccCreateElevenLabsFormErrRes> &
            ConstructorParameters<typeof xAPIAccCreateElevenLabsFormErrRes<T>>[0],
    ) {
        super(bodyObject);
    }
}

export class xAPIAccCreateElevenLabsFormPassErrRes<
    T extends iAPIAccCreateElevenLabsFormPassErrRes = iAPIAccCreateElevenLabsFormPassErrRes,
> extends xAPIAccCreateElevenLabsFormErrRes<T> {
    constructor(
        bodyObject: Delta<iAPIAccCreateElevenLabsFormErrRes, iAPIAccCreateElevenLabsFormPassErrRes> &
            ConstructorParameters<typeof xAPIAccCreateElevenLabsFormErrRes<T>>[0],
    ) {
        super(bodyObject);
    }
}

export class xAPIAccCreateElevenLabsFormAPIKeyErrRes<
    T extends iAPIAccCreateElevenLabsFormAPIKeyErrRes = iAPIAccCreateElevenLabsFormAPIKeyErrRes,
> extends xAPIAccCreateElevenLabsFormErrRes<T> {
    constructor(
        bodyObject: Delta<iAPIAccCreateElevenLabsFormErrRes, iAPIAccCreateElevenLabsFormAPIKeyErrRes> &
            ConstructorParameters<typeof xAPIAccCreateElevenLabsFormErrRes<T>>[0],
    ) {
        super(bodyObject);
    }
}

export class xAPIAccCreateElevenLabsAPIErrRes<
    T extends iAPIAccCreateElevenLabsAPIErrRes = iAPIAccCreateElevenLabsAPIErrRes,
> extends xAPIAccCreateElevenLabsErrRes<T> {
    constructor(
        statusCode: number,
        bodyObject: Delta<iAPIAccCreateElevenLabsErrRes, iAPIAccCreateElevenLabsAPIErrRes> &
            ConstructorParameters<typeof xAPIAccCreateElevenLabsErrRes<T>>[1],
    ) {
        super(statusCode, bodyObject);
    }
}

export type APIAccCreateElevenLabsRes =
    | xAPIAccCreateElevenLabsErrRes
    | xAPIAccCreateElevenLabsAPIErrRes
    | xAPIAccCreateElevenLabsFormAPIKeyErrRes
    | xAPIAccCreateElevenLabsFormEmailErrRes
    | xAPIAccCreateElevenLabsFormPassErrRes
    | xAPIAccCreateElevenLabsSuccRes;
