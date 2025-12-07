export type tFnReturn<RetType = unknown, ErrType = {}> = tNoThrowRet<RetType> | tNoThrowErr<ErrType>;
export type tNoThrowErr<ErrType> = { readonly ret?: undefined; readonly err: ErrType };
export type tNoThrowRet<RetType> = { readonly ret: RetType; readonly err?: undefined };
export type tNoRetFnReturn<ErrType = {}> = { ret: null; err: ErrType };
export type tAsyncFnReturn<RetType = unknown, ErrType extends {} = {}> = Promise<tFnReturn<RetType, ErrType>>;

export class xNoThrowFn {
    static ret(): tNoThrowRet<undefined>;
    static ret<const RetType>(ret: RetType): tNoThrowRet<RetType>;

    static ret<const RetType>(ret?: RetType) {
        if (ret !== undefined) {
            // return new xNoThrowRet(ret);
            return { ret } satisfies tNoThrowRet<RetType>;
        }

        return { ret: undefined } satisfies tNoThrowRet<undefined>;
    }

    static err<ErrType>(err: ErrType) {
        return { err } satisfies tNoThrowErr<ErrType>;
    }
}

export type tNoThrowFn = (...args: readonly any[]) => tFnReturn;
export type tNoThrowAsyncFn = (...args: readonly any[]) => tAsyncFnReturn;

export type tNoThrowAsyncFnRet<tNoThrowFn extends tNoThrowAsyncFn> =
    Awaited<ReturnType<tNoThrowFn>> extends infer T ? (T extends { ret: infer tRet } ? tRet : never) : never;

export type tNoThrowAsyncFnErr<tNoThrowFn extends tNoThrowAsyncFn> =
    Awaited<ReturnType<tNoThrowFn>> extends infer T ? (T extends { err: infer tErr } ? tErr : never) : never;

export type tNoThrowAsyncFnFilterRet<T extends tAsyncFnReturn> =
    Awaited<T> extends infer X ? (X extends { ret: infer RetType; err: null } ? RetType : never) : never;

export type tNoThrowAsyncFnFilterErrHelper<T extends tAsyncFnReturn> =
    Awaited<T> extends infer X ? (X extends { err: infer ErrType } ? ErrType : never) : never;

export type tNoThrowAsyncFnFilterErr<T extends tAsyncFnReturn> = Exclude<tNoThrowAsyncFnFilterErrHelper<T>, null>;
