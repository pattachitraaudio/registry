import { NextRequest, NextResponse } from "next/server";
import { Flatten } from "./lib/enum";

type RouteHandlerType = (req: NextRequest) => Promise<NextResponse<unknown>>;
type RouteHandlerReturnTypeHelper<T> = T extends NextResponse<infer Y> ? Y : never;
type RouteHandlerReturnType<T extends (req: NextRequest) => unknown, U = ReturnType<T>> =
    U extends Promise<infer X> ? RouteHandlerReturnTypeHelper<X> : never;

/*
type tRouteResponseTypeObject = {
    api: {
        auth: {
            signUp: {
                // POST: RouteHandlerReturnType<typeof import("@/app/api/auth/signUp/route").POST>;
                POST: typeof import("@/app/api/auth/signUp/route").POST;
            };
            verifyEmail: {};
            login: {
                // POST: RouteHandlerReturnType<typeof import("@/app/api/auth/login/route").POST>;
                POST: typeof import("@/app/api/auth/login/route").POST;
            };
            session: {};
            resetPassword: {};
            resendVfEmail: {};
        };
    };
};
*/

type Obj<T> = {
    [K in keyof T]: T[K];
} & {};
type tRouteResponseTypeObject = {
    api: {
        auth: {
            signUp: typeof import("@/app/api/auth/signUp/route");
            verifyEmail: typeof import("@/app/api/auth/verifyEmail/route");
            login: typeof import("@/app/api/auth/login/route");
            session: typeof import("@/app/api/auth/session/route");
            resetPassword: typeof import("@/app/api/auth/resetPassword/route");
            resendVfEmail: typeof import("@/app/api/auth/resendVfEmail/route");
        };
    };
};

type HTTPMethodKeyObject = {
    [K in "GET" | "POST" | "PUT" | "PATCH" | "DELETE"]?: Function;
};

type RecursiveObjectType = {
    [key: string]: HTTPMethodKeyObject | RecursiveObjectType;
};

/*
type ABC = typeof import("@/app/api/auth/signUp/route");


type ObjABC = Obj<ABC>;
*/

type __XYA<T extends RecursiveObjectType, Prefix extends string = ""> = {
    [K in keyof T]: T[K] extends HTTPMethodKeyObject
        ? Prefix extends ""
            ? { [Key in `${string & K}`]: Obj<T[K]> }
            : { [Key in `${Prefix}/${string & K}`]: Obj<T[K]> }
        : T[K] extends RecursiveObjectType
          ? __XYA<T[K], Prefix extends "" ? `${string & K}` : `${Prefix}/${string & K}`>
          : never;
}[keyof T];

type AppendPrefixToObjectKeys<O extends object, Prefix extends string> = {
    [K in keyof O as `${Prefix}${K & string}`]: O[K];
} & {};

type UnionToIntersection<U> = (U extends unknown ? (k: U) => void : never) extends (k: infer I) => void ? I : never;

export type APIRoute = Obj<UnionToIntersection<AppendPrefixToObjectKeys<__XYA<tRouteResponseTypeObject>, "/">>>;
// type X = AB["/api/auth/signUp"]["POST"]
export type GetResponseType<
    Path extends keyof APIRoute,
    Method extends keyof APIRoute[Path],
> = APIRoute[Path][Method] extends RouteHandlerType ? RouteHandlerReturnType<APIRoute[Path][Method]> : never;

type Res = GetResponseType<"/api/auth/signUp", "POST">;
type Res2 = GetResponseType<"/api/auth/login", "POST">;
/*
type AB = {
    "api/auth/signUp": ["POST"];
} | {
    "api/auth/login": ["POST"];
}
*/
// export type tRouteResponseType<Route> =

// type HasSlash
// type H<Str extends string> = Str extends `${infer First extends string}/${infer Rest extends string}` ? First : never;
/*
type Attribute<T extends `/${string}`> = T extends `/${infer X extends string}` ? X : never;

type TraverseObject<
    O extends object,
    Path extends `/${string}`,
> = Path extends `/${infer First extends string}/${infer Rest extends string}`
    ? First extends keyof O
        ? O[First] extends object
            ? TraverseObject<O[First], `/${Rest}`>
            : never
        : never
    : Path extends "/"
      ? O
      : Attribute<Path> extends keyof O
        ? O[Attribute<Path>]
        : never;

// type X = H<"hello/world">;
type D = TraverseObject<tRouteResponseTypeObject, "/api/auth/signUp">;

*/
// fetch("", {method:})
// Http2ServerRequest()
// function httpReq()

// type X = "" extends "" ? true : false;

// export type tRouteResponse<Path extends `/${string}`, Method extends >
