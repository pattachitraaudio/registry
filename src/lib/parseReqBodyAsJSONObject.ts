import { TextDecoder } from "node:util";
import { xNoThrowFn } from "./xNoThrow";
import { tJObject, tJSON } from "./util";

const MAX_BODY_SIZE_IN_BYTES = 1024;

export function parseReqBodyAsJSONObjectFactory(maxBodyBytes: number) {
    return function (req: Request) {
        return parseReqBodyAsJSONObject(req, maxBodyBytes);
    };
}

export async function parseReqBodyAsJSONObject(req: Request, maxBodyBytes?: number) {
    if (maxBodyBytes == null) {
        maxBodyBytes = MAX_BODY_SIZE_IN_BYTES;
    }

    const stream = req.body;

    if (stream == null) {
        return xNoThrowFn.err("internal-err stream is not present");
    }

    const chunks: Uint8Array[] = [];
    const streamReader = stream.getReader();

    let totalSize = 0;

    while (true) {
        const { done, value } = await streamReader.read();

        if (done) {
            break;
        }

        if (value) {
            totalSize += value.length;

            if (totalSize > maxBodyBytes) {
                return xNoThrowFn.err("request-body length exceeded");
            }
        }

        chunks.push(value);
    }

    let offset = 0;
    const combined = new Uint8Array(totalSize);

    for (const chunk of chunks) {
        combined.set(chunk, offset);
        offset += chunk.length;
    }

    const textDecoder = new TextDecoder("utf-8");
    const stringBody = textDecoder.decode(combined);

    try {
        const json: tJSON = JSON.parse(stringBody);

        if (typeof json !== "object") {
            return xNoThrowFn.err(`expected json object: {} but got ${typeof json} instead`);
        }

        if (Array.isArray(json)) {
            return xNoThrowFn.err(`expected json object: {} but got array: [] instead`);
        }

        const jsonObject: tJObject = json;
        return xNoThrowFn.ret(jsonObject);
    } catch {
        return xNoThrowFn.err("failed to parse json body");
    }
}
