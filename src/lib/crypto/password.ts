import { bPassword } from "@/brands/password";
import bcrypt from "bcrypt";
import { Brand } from "../util";
import { xNoThrowFn } from "../xNoThrow";

export type bHashedPassword = Brand<string, "HashedPassword">;

export async function hashPassword(password: bPassword) {
    return xNoThrowFn.ret((await bcrypt.hash(password, 8)) as bHashedPassword);
}

export async function comparePasswordHash(password: bPassword, hashedPassword: bHashedPassword) {
    return xNoThrowFn.ret(await bcrypt.compare(password, hashedPassword));
}
