import { xAPIErrRes, xAPISuccRes, iAPIErrRes, iAPISuccRes } from "@/types/apiResponse/xAPIRes";
import { Delta } from "@/lib/util";
import { TCode } from "@/lib/enum";
import { APIResCode } from "@/enums/APIResCode";
import { iUser } from "@/interfaces/iUser";

type SessErrCode = typeof APIResCode.Error.Session;

type iAPISessErrRes = iAPIErrRes & {
    code: TCode<SessErrCode> & {};
};

type iAPISessSuccRes = iAPISuccRes & {
    data: {
        user: iUser;
    };
};

type iAPISessJWTErrRes = iAPISessErrRes & {
    code: TCode<SessErrCode["JWT"]> & {};
};

export class xAPISessSuccRes extends xAPISuccRes<iAPISessSuccRes> {
    constructor(
        body: Delta<iAPISuccRes, iAPISessSuccRes> & ConstructorParameters<typeof xAPISuccRes<iAPISessSuccRes>>[2],
    ) {
        super(200, [], body);
    }
}

export class xAPISessErrRes<T extends iAPISessErrRes = iAPISessErrRes> extends xAPIErrRes<T> {
    constructor(statusCode: number, body: Delta<iAPIErrRes, T> & ConstructorParameters<typeof xAPIErrRes<T>>[1]) {
        super(statusCode, body);
    }
}

export class xAPISessJWTErrRes<T extends iAPISessJWTErrRes = iAPISessJWTErrRes> extends xAPISessErrRes<T> {
    constructor(body: Delta<iAPISessErrRes, T> & ConstructorParameters<typeof xAPISessErrRes<T>>[1]) {
        super(401, body);
    }
}

export type tAPISessRes = xAPISessSuccRes | xAPISessJWTErrRes | xAPISessErrRes | xAPIErrRes;
