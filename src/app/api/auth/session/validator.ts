import { iSessionPayload } from "@/lib/session";
import { Brand, tJObject } from "@/lib/util";
import { xNoThrowFn } from "@/lib/xNoThrow";

export type bSessionReq = Brand<{}, "Session">;

export const validateSessionReqBodyJSON = async function (body: tJObject, sessionPayload: iSessionPayload) {
    return xNoThrowFn.ret({} as bSessionReq);
};
