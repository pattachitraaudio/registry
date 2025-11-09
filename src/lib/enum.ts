export type RecursiveObjectType = {
    [key: string]: string | number | boolean | Function | RecursiveObjectType;
};

/*
export function buildCodeNameMap(recursiveCodeEnumObject: RecursiveEnumObjectType): TypeCodeNameMap {
    function append(arr: [number, string][], str: string): [number, string][] {
        return arr.map((entry) => {
            const [key, val] = entry;
            return [key, str + val];
        });
    }

    function helper(recursiveCodeEnumObject: RecursiveEnumObjectType): [number, string][] {
        const tuples = new Array<[number, string]>();

        Object.entries(recursiveCodeEnumObject).forEach((entry) => {
            const [key, val]: [string, number | RecursiveEnumObjectType] = entry;

            if (typeof val === "number") {
                tuples.push([val, key]);
            } else {
                tuples.push(...append(helper(val), key + "."));
            }
        });

        return tuples;
    }

    return new Map<number, string>(helper(recursiveCodeEnumObject));
}
    */

export type ValueOf<T extends object> = T[keyof T] & {};

type UnionToIntersection<U> = (U extends unknown ? (k: U) => void : never) extends (k: infer I) => void ? I : never;

// Type-level utility for flattening objects
type __Flatten<T, Prefix extends string, Separator extends string> = {
    [K in keyof T]: T[K] extends RecursiveObjectType
        ? __Flatten<T[K], Prefix extends "" ? `${string & K}` : `${Prefix}${Separator}${string & K}`, Separator>
        : Prefix extends ""
          ? { [Key in `${string & K}`]: T[K] }
          : { [Key in `${Prefix}${Separator}${string & K}`]: T[K] };
}[keyof T];

/********  */
/* // TODO: Why does this give circular reference error?
type Flatten<T, Prefix extends string = ""> = ValueOf<{
    [K in keyof T]: T[K] extends RecursiveEnumObjectType
        ? Flatten<T[K], Prefix extends "" ? `${string & K}` : `${Prefix}.${string & K}`>
        : Prefix extends ""
          ? { [Key in `${string & K}`]: T[K] }
          : { [Key in `${Prefix}.${string & K}`]: T[K] };
}> & {};

        */
export type Flatten<T extends RecursiveObjectType> =
    UnionToIntersection<__Flatten<T, "", ".">> extends infer X
        ? {
              [K in keyof X]: X[K];
          }
        : never;

type KeyType = string | number;
export type InvertObjectKV<T extends Record<KeyType, KeyType>> = {
    [K in keyof T as T[K]]: K;
} & {};

export function flatten<T extends RecursiveObjectType>(recursiveEnumObject: T): Flatten<typeof recursiveEnumObject> {
    function helper<T extends RecursiveObjectType>(obj: T): Flatten<T> {
        const flatObj: unknown = {}; // Make this code proper (don't use "as")

        Object.entries(obj).forEach((entry) => {
            const [k, v] = entry;

            if (typeof v === "string" || typeof v === "number" || typeof v === "boolean" || typeof v === "function") {
                (flatObj as { [k]: typeof v })[k] = v;
            } else {
                Object.entries(helper(v)).forEach(([k2, v2]) => {
                    (flatObj as { [k]: typeof v2 })[k + "." + k2] = v2;
                });
            }
        });

        return flatObj as Flatten<T>;
    }

    return helper(recursiveEnumObject);
}

export function invertObjectKV<T extends Record<KeyType, KeyType>>(obj: T): InvertObjectKV<T> {
    const inv: unknown = {};

    Object.entries(obj).forEach(([k, v]) => {
        (inv as { [v]: typeof k })[v] = k;
    });

    return inv as InvertObjectKV<T>;
}

export type TCode<T extends RecursiveObjectType> = ValueOf<Flatten<T>>;
