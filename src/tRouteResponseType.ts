import { NextRequest, NextResponse } from "next/server";
import { Flatten } from "./lib/enum";

type RouteHandlerType = (req: NextRequest) => Promise<NextResponse<unknown>>;
type RouteHandlerReturnTypeHelper<T> = T extends NextResponse<infer Y> ? Y : never;
type RouteHandlerReturnType<T extends (req: NextRequest) => unknown, U = ReturnType<T>> =
    U extends Promise<infer X> ? RouteHandlerReturnTypeHelper<X> : never;

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
            logout: typeof import("@/app/api/auth/logout/route");
        };
        account: {
            elevenLabs: {
                get: typeof import("@/app/api/pool/elevenLabs/get/route");
                add: typeof import("@/app/api/pool/elevenLabs/add/route");
                delete: typeof import("@/app/api/pool/elevenLabs/delete/route");
            };
        };
    };
};

type HTTPMethodKeyObject = {
    [K in "GET" | "POST" | "PUT" | "PATCH" | "DELETE"]?: (req: NextRequest) => unknown;
};

type RecursiveObjectType = {
    [key: string]: HTTPMethodKeyObject | RecursiveObjectType;
};

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

export type GetResponseType<
    Path extends keyof APIRoute,
    Method extends keyof APIRoute[Path],
> = APIRoute[Path][Method] extends RouteHandlerType ? RouteHandlerReturnType<APIRoute[Path][Method]> : never;
