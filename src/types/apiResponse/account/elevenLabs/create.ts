import { APIResCode } from "@/enums/APIResCode";
import { iAPIErrRes, iAPISuccRes, xAPIErrRes, xAPISuccRes } from "@/types/apiResponse/xAPIRes";
import { Flatten, ValueOf } from "@/lib/enum";
import { Delta } from "@/lib/utils";
import { tElevenLabsUserRes } from "@/schemas/account/sElevenLabsUserResponse";

type AccAddResCode = typeof APIResCode.Error.Account.ElevenLabs.Add;

export interface iAPIAccAddElevenLabsSuccRes extends iAPISuccRes {
    data: tElevenLabsUserRes;
}

export interface iAPIAccAddElevenLabsErrRes extends iAPIErrRes {
    code: ValueOf<Flatten<AccAddResCode>>;
}

type AccAddFormErrResCode = AccAddResCode["Form"];

export interface iAPIAccAddElevenLabsFormErrRes extends iAPIAccAddElevenLabsErrRes {
    code: ValueOf<Flatten<AccAddFormErrResCode>>;
}

export interface iAPIAccAddElevenLabsFormEmailErrRes extends iAPIAccAddElevenLabsFormErrRes {
    code: ValueOf<Flatten<AccAddFormErrResCode["Email"]>>;
}

export interface iAPIAccAddElevenLabsFormPassErrRes extends iAPIAccAddElevenLabsFormErrRes {
    code: ValueOf<Flatten<AccAddFormErrResCode["Password"]>>;
}

export interface iAPIAccAddElevenLabsFormAPIKeyErrRes extends iAPIAccAddElevenLabsFormErrRes {
    code: ValueOf<Flatten<AccAddFormErrResCode["APIKey"]>>;
}

export interface iAPIAccAddElevenLabsAPIErrRes extends iAPIAccAddElevenLabsErrRes {}

export class xAPIAccAddElevenLabsSuccRes<
    T extends iAPIAccAddElevenLabsSuccRes = iAPIAccAddElevenLabsSuccRes,
> extends xAPISuccRes<T> {
    constructor(body: Delta<iAPISuccRes, T> & ConstructorParameters<typeof xAPISuccRes<T>>[2]) {
        super(201, [], body);
    }
}

export class xAPIAccAddElevenLabsErrRes<
    T extends iAPIAccAddElevenLabsErrRes = iAPIAccAddElevenLabsErrRes,
> extends xAPIErrRes<T> {
    constructor(
        statusCode: number,
        body: Delta<iAPIErrRes, iAPIAccAddElevenLabsErrRes> & ConstructorParameters<typeof xAPIErrRes<T>>[1],
    ) {
        super(statusCode, body);
    }
}

export class xAPIAccAddElevenLabsFormErrRes<
    T extends iAPIAccAddElevenLabsFormErrRes = iAPIAccAddElevenLabsFormErrRes,
> extends xAPIAccAddElevenLabsErrRes<T> {
    constructor(
        bodyObject: Delta<iAPIErrRes, iAPIAccAddElevenLabsFormErrRes> &
            ConstructorParameters<typeof xAPIAccAddElevenLabsErrRes<T>>[1],
    ) {
        super(400, bodyObject);
    }
}

export class xAPIAccAddElevenLabsFormEmailErrRes<
    T extends iAPIAccAddElevenLabsFormEmailErrRes = iAPIAccAddElevenLabsFormEmailErrRes,
> extends xAPIAccAddElevenLabsFormErrRes<T> {
    constructor(
        bodyObject: Delta<iAPIAccAddElevenLabsFormErrRes, iAPIAccAddElevenLabsFormErrRes> &
            ConstructorParameters<typeof xAPIAccAddElevenLabsFormErrRes<T>>[0],
    ) {
        super(bodyObject);
    }
}

export class xAPIAccAddElevenLabsFormPassErrRes<
    T extends iAPIAccAddElevenLabsFormPassErrRes = iAPIAccAddElevenLabsFormPassErrRes,
> extends xAPIAccAddElevenLabsFormErrRes<T> {
    constructor(
        bodyObject: Delta<iAPIAccAddElevenLabsFormErrRes, iAPIAccAddElevenLabsFormPassErrRes> &
            ConstructorParameters<typeof xAPIAccAddElevenLabsFormErrRes<T>>[0],
    ) {
        super(bodyObject);
    }
}

export class xAPIAccAddElevenLabsFormAPIKeyErrRes<
    T extends iAPIAccAddElevenLabsFormAPIKeyErrRes = iAPIAccAddElevenLabsFormAPIKeyErrRes,
> extends xAPIAccAddElevenLabsFormErrRes<T> {
    constructor(
        bodyObject: Delta<iAPIAccAddElevenLabsFormErrRes, iAPIAccAddElevenLabsFormAPIKeyErrRes> &
            ConstructorParameters<typeof xAPIAccAddElevenLabsFormErrRes<T>>[0],
    ) {
        super(bodyObject);
    }
}

export class xAPIAccAddElevenLabsAPIErrRes<
    T extends iAPIAccAddElevenLabsAPIErrRes = iAPIAccAddElevenLabsAPIErrRes,
> extends xAPIAccAddElevenLabsErrRes<T> {
    constructor(
        statusCode: number,
        bodyObject: Delta<iAPIAccAddElevenLabsErrRes, iAPIAccAddElevenLabsAPIErrRes> &
            ConstructorParameters<typeof xAPIAccAddElevenLabsErrRes<T>>[1],
    ) {
        super(statusCode, bodyObject);
    }
}

export type APIAccAddElevenLabsRes =
    | xAPIAccAddElevenLabsErrRes
    | xAPIAccAddElevenLabsAPIErrRes
    | xAPIAccAddElevenLabsFormAPIKeyErrRes
    | xAPIAccAddElevenLabsFormEmailErrRes
    | xAPIAccAddElevenLabsFormPassErrRes
    | xAPIAccAddElevenLabsSuccRes;
