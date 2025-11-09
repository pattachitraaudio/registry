import { APIRoute, GetResponseType } from "./tRouteResponseType";

export async function neoFetch<Path extends keyof APIRoute, Method extends keyof APIRoute[Path]>(
    path: Path,
    init: RequestInit & { method: Method },
): Promise<GetResponseType<Path, Method>> {
    const res = await fetch(path, init);
    return await res.json();
}
