import { xAPIErrRes, xAPIRes, xAPISuccRes, iAPIErrRes, iAPISuccRes } from "@/types/apiResponse/xAPIRes";
import { Delta } from "@/lib/utils";

import { Flatten, TCode, ValueOf } from "@/lib/enum";
import { APIResCode } from "@/enums/APIResCode";
import { IUser } from "@/interfaces/iUser";
import { PrettifyObject } from "@/lib/utils";

/*
import { nAPIResponse } 

export namespace nAPIResponse {
    export namespace nSession {
        export interface iError extends iAPIErrRes {
            code: ValueOf<Flatten<typeof APIResCode.Error.Session>>;
        }

        export interface iSuccess extends iAPISuccRes {
            code: typeof APIResCode.SUCCESS;
            data: {
                user: IUser;
            };
        }

        export class xSuccess<T extends iSuccess> extends xAPISuccRes<T> {
            constructor(
                bodyObject: Delta<iAPISuccRes, iSuccess> &
                    ConstructorParameters<typeof xAPISuccRes<T>>[2],
            ) {
                super(200, [], bodyObject);
            }
        }

        export class xError<T extends iError = iError> extends xAPIErrRes<T> {
            constructor(
                statusCode: number,
                bodyObject: Delta<iError, T> & ConstructorParameters<typeof xAPIErrRes<T>>[1],
            ) {
                super(statusCode, bodyObject);
            }
        }

        export namespace nJWT {
            export interface iError extends nSession.iError {
                code: ValueOf<Flatten<typeof APIResCode.Error.Session.JWT>>;
            }

            export class xError<T extends iError> extends nSession.xError<T> {
                constructor(
                    bodyObject: Delta<iAPIErrRes, T> & ConstructorParameters<typeof nSession.xError<T>>[1],
                ) {
                    super(401, bodyObject);
                }
            }
        }
    }
}
    */

type SessErrCode = typeof APIResCode.Error.Session;

type iAPISessErrRes = iAPIErrRes & {
    code: TCode<SessErrCode> & {};
};

type iAPISessSuccRes = iAPISuccRes & {
    data: {
        user: IUser;
    };
};

type iAPISessJWTErrRes = iAPISessErrRes & {
    code: TCode<SessErrCode["JWT"]> & {};
};

// type BodyType<ParentI extends object, I extends ParentI , ParentC> = Delta<ParentI, I> & ConstructorParameters<I>
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

// export type tAPISessRes = typeof xAPISessJWTErrRes<iAPISessJWTErrRes>;
export type tAPISessRes = xAPISessSuccRes | xAPISessJWTErrRes | xAPISessErrRes | xAPIErrRes;
