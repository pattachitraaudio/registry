import { createRoute, tHandlerFn } from "./createRoute";
import { tJObject } from "./util";
import { xNextRes } from "./xNextRes";
import { tAsyncFnReturn, xNoThrowFn } from "./xNoThrow";
import { createAuthenticatedRoute } from "./createAuthenticatedRoute";

type tAuthenticatedRouteFn = ReturnType<
    typeof createAuthenticatedRoute<tAsyncFnReturn<any>, ReturnType<tHandlerFn>, any>
>;
type tUnauthenticatedRouteFn = ReturnType<typeof createRoute<tAsyncFnReturn<any>, ReturnType<tHandlerFn>, any>>;

type tRouteFn = tAuthenticatedRouteFn | tUnauthenticatedRouteFn;

type tRouteObject = {
    [Key in "GET" | "POST" | "PUT" | "PATCH" | "DELETE"]?: tRouteFn | tAuthenticatedRouteFn;
};

type tRecursiveObject = {
    [key: string]: tRouteObject | tRecursiveObject;
};

/*
type Transform<T extends object> = (T extends (...args: infer ArgTypes) => infer ReturnType
    ? (...args: ArgTypes) => ReturnType
    : unknown) & {
    [K in keyof T]: T[K] extends object ? Transform<T[K]> : T[K];
} & {};
 */

type tRouteImport = {
    api: {
        auth: {
            signUp: typeof import("@/app/api/auth/signUp/route");
            verifyEmail: typeof import("@/app/api/auth/verifyEmail/route");
            login: typeof import("@/app/api/auth/login/route");
            session: typeof import("@/app/api/auth/session/route");
            // resetPassword: typeof import("@/app/api/auth/resetPassword/route");
            resendVfEmail: typeof import("@/app/api/auth/resendVfEmail/route");
            // logout: typeof import("@/app/api/auth/logout/route");
        };
        account: {
            elevenLabs: {
                // get: typeof import("@/app/api/pool/elevenLabs/get/route");
                // add: typeof import("@/app/api/pool/elevenLabs/add/route");
                // delete: typeof import("@/app/api/pool/elevenLabs/delete/route");
            };
        };
    };
};

/*
type tRouteHandlerReturnHelper<T> =
    T extends xNextRes<infer BodyType, infer StatusCodeType> ? { body: BodyType; statusCode: StatusCodeType } : never;

type tRouteHandlerReturn<T extends tRouteFn, U = ReturnType<T>> =
    U extends Promise<infer ReturnType> ? tRouteHandlerReturnHelper<ReturnType> : never;
    */

type tFlattenRoute<T extends tRecursiveObject, Prefix extends string = ""> = {
    [K in keyof T]: T[K] extends tRouteObject
        ? Prefix extends ""
            ? { [Key in `${string & K}`]: T[K] }
            : { [Key in `${Prefix}/${string & K}`]: T[K] }
        : T[K] extends tRecursiveObject
          ? tFlattenRoute<T[K], Prefix extends "" ? `${string & K}` : `${Prefix}/${string & K}`>
          : never;
}[keyof T];

type AppendPrefixToObjectKeys<O extends object, Prefix extends string> = {
    [K in keyof O as `${Prefix}${K & string}`]: O[K];
} & {};

type UnionToIntersection<U> = (U extends unknown ? (k: U) => void : never) extends (k: infer I) => void ? I : never;

export type tAPIRoute = UnionToIntersection<AppendPrefixToObjectKeys<tFlattenRoute<tRouteImport>, "/">>;

// export type Xyz = tAPIRoute["/api/auth/signUp"] extends tRouteObject ? true : false;
type tGetBody<
    Path extends keyof tAPIRoute,
    Method extends keyof tAPIRoute[Path],
> = tAPIRoute[Path][Method] extends infer RouteFn extends tRouteFn ? Parameters<RouteFn["handlerFn"]>[0] : never;

// type tGetRouteValidator<Path extends keyof tAPIRoute, Method extends keyof tAPIRoute[Path]> = tAPIRoute[Path][Method];

export type tReq<
    Path extends keyof tAPIRoute,
    Method extends keyof tAPIRoute[Path],
    RouteFn = tAPIRoute[Path][Method],
> = RouteFn extends tRouteFn ? Parameters<RouteFn["handlerFn"]>["0"] : never;

type tResHelper<
    Path extends keyof tAPIRoute,
    Method extends keyof tAPIRoute[Path],
    RouteFn = tAPIRoute[Path][Method],
> = RouteFn extends tRouteFn
    ? RouteFn extends tAuthenticatedRouteFn
        ? Awaited<ReturnType<RouteFn["sessionValidatorFn"]>> | Awaited<ReturnType<RouteFn["handlerFn"]>>
        : Awaited<ReturnType<RouteFn["handlerFn"]>>
    : never;

type tResTransform<T> = T extends { ret: xNextRes<infer Body extends tJObject, infer StatusCode extends number> }
    ? iRes<Body, StatusCode>
    : T extends { err: xNextRes<infer Body extends tJObject, infer StatusCode extends number> }
      ? iRes<Body, StatusCode>
      : never;

type tRes<
    Path extends keyof tAPIRoute,
    Method extends keyof tAPIRoute[Path],
    RouteFn = tAPIRoute[Path][Method],
> = tResTransform<tResHelper<Path, Method, RouteFn>>;

interface iRes<Body extends tJObject = tJObject, StatusCode extends number = number> {
    body: Body;
    statusCode: StatusCode;
    // headers: [key: string, val: string][];
}

export const neoFetch = async function <
    const Path extends keyof tAPIRoute,
    const Method extends keyof tAPIRoute[Path] & string,
    // Body extends tAPIRoute[Path][Method]["handlerFn"],
>(path: Path, init: Omit<RequestInit, "body"> & { method: Method; body: tGetBody<Path, Method> }) {
    // fetch;
    try {
        const res = await fetch(path, { ...init, body: JSON.stringify(init.body) });
        try {
            const jsonBody = await res.json();
            // const headers = Array.from(res.headers.entries());
            const transformedRes = { body: jsonBody, statusCode: res.status } as tRes<Path, Method>;
            return xNoThrowFn.ret(transformedRes);
        } catch (err) {
            return xNoThrowFn.err({ jsonParseErr: err });
        }
    } catch (err) {
        return xNoThrowFn.err({ fetchErr: err });
    }
};

/*
type WW = tAPIRoute["/api/auth/login"]["POST"]["handlerFn"];
type XX = tResHelper<"/api/auth/login", "POST">;

type YY = tResTransform<XX>;
type aaaa = tRes<"/api/auth/login", "POST">;
/*
const x = await neoFetch("/api/auth/login", { method: "POST" });

if (x.err == null) {
    const y = x;
    const out = x.ret;
}
    */

/*
{
    /// type aaa = tGetBody<"/api/auth/signUp", "POST">;
    type abc = tRes<"/api/auth/signUp", "POST">;
    const body = await validateSignUpReqBodyJSON({});

    if (body.err == null) {
        const a = await neoFetch("/api/auth/signUp", {
            method: "POST",
            // body: {},
            body: body.ret,
        });

        if (a.err == null) {
            const re = a.ret;
        }
    }
}

*/

/*
Type 'tRouteImport' does not satisfy the constraint 'tRecursiveObject'.
  Property 'api' is incompatible with index signature.
    Type '{ auth: { signUp: typeof import("d:/pattachitraaudio/registry/src/app/api/auth/signUp/route"); verifyEmail: typeof import("d:/pattachitraaudio/registry/src/app/api/auth/verifyEmail/route"); login: typeof import("d:/pattachitraaudio/registry/src/app/api/auth/login/route"); session: typeof import("d:/pattachitraaudio/...' is not assignable to type 'tRouteObject | tRecursiveObject'.
      Type '{ auth: { signUp: typeof import("d:/pattachitraaudio/registry/src/app/api/auth/signUp/route"); verifyEmail: typeof import("d:/pattachitraaudio/registry/src/app/api/auth/verifyEmail/route"); login: typeof import("d:/pattachitraaudio/registry/src/app/api/auth/login/route"); session: typeof import("d:/pattachitraaudio/...' is not assignable to type 'tRecursiveObject'.
        Property 'auth' is incompatible with index signature.
          Type '{ signUp: typeof import("d:/pattachitraaudio/registry/src/app/api/auth/signUp/route"); verifyEmail: typeof import("d:/pattachitraaudio/registry/src/app/api/auth/verifyEmail/route"); login: typeof import("d:/pattachitraaudio/registry/src/app/api/auth/login/route"); session: typeof import("d:/pattachitraaudio/registry...' is not assignable to type 'tRouteObject | tRecursiveObject'.
            Type '{ signUp: typeof import("d:/pattachitraaudio/registry/src/app/api/auth/signUp/route"); verifyEmail: typeof import("d:/pattachitraaudio/registry/src/app/api/auth/verifyEmail/route"); login: typeof import("d:/pattachitraaudio/registry/src/app/api/auth/login/route"); session: typeof import("d:/pattachitraaudio/registry...' is not assignable to type 'tRecursiveObject'.
              Property 'session' is incompatible with index signature.
                Type 'typeof import("d:/pattachitraaudio/registry/src/app/api/auth/session/route")' is not assignable to type 'tRouteObject | tRecursiveObject'.
                  Type 'typeof import("d:/pattachitraaudio/registry/src/app/api/auth/session/route")' is not assignable to type 'tRecursiveObject'.
                    Property 'GET' is incompatible with index signature.
                      Type '{ (req: NextRequest): Promise<NextResponse<unknown>>; handlerFn: (req: { [brand]: "Session"; }, sessionPayload: iSessionPayload) => Promise<...>; reqBodyJSONValidatorFn: (body: tJObject, sessionPayload: iSessionPayload) => Promise<...>; }' is not assignable to type 'tRouteObject | tRecursiveObject'.
                        Type '{ (req: NextRequest): Promise<NextResponse<unknown>>; handlerFn: (req: { [brand]: "Session"; }, sessionPayload: iSessionPayload) => Promise<...>; reqBodyJSONValidatorFn: (body: tJObject, sessionPayload: iSessionPayload) => Promise<...>; }' is not assignable to type 'tRecursiveObject'.
                          Index signature for type 'string' is missing in type '{ (req: NextRequest): Promise<NextResponse<unknown>>; handlerFn: (req: { [brand]: "Session"; }, sessionPayload: iSessionPayload) => Promise<...>; reqBodyJSONValidatorFn: (body: tJObject, sessionPayload: iSessionPayload) => Promise<...>; }'.
                          */
