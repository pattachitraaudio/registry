import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

export type Delta<Parent extends object, Child extends Parent> = {
    [C in keyof Child as C extends keyof Parent ? (Parent[C] extends Child[C] ? never : C) : C]: C extends keyof Parent
        ? Parent[C] extends object
            ? Delta<Parent[C], Child[C]>
            : Child[C]
        : Child[C];
} & {};

type TypeJSONString = string;
type TypeJSONNumber = number;
type TypeJSONBoolean = boolean;
type TypeJSONNull = null;

export type TypeJSONObject = {
    [key: string]: TypeJSONObject | TypeJSONArray | TypeJSONString | TypeJSONNumber | TypeJSONBoolean | TypeJSONNull;
};

type TypeJSONArray = (
    | TypeJSONObject
    | TypeJSONArray
    | TypeJSONString
    | TypeJSONNumber
    | TypeJSONBoolean
    | TypeJSONNull
)[];

export function cloneJSONObject(o: TypeJSONObject) {
    const clone: TypeJSONObject = {};

    for (const entry of Object.entries(o)) {
        const [key, val] = entry;

        if (Array.isArray(val)) {
            clone[key] = cloneJSONArray(val);
        } else if (typeof val === "object" && val !== null) {
            clone[key] = cloneJSONObject(val);
        } else {
            clone[key] = val;
        }
    }

    return clone;
}

export function cloneJSONArray(a: TypeJSONArray) {
    const clone: TypeJSONArray = [];

    a.forEach((val, index) => {
        if (Array.isArray(val)) {
            clone[index] = cloneJSONArray(val);
        } else if (typeof val === "object" && val !== null) {
            clone[index] = cloneJSONObject(val);
        } else {
            clone[index] = val;
        }
    });

    return clone;
}

export function mergeJSONObjects(a: TypeJSONObject, b: TypeJSONObject): TypeJSONObject {
    const merged: TypeJSONObject = {};

    for (const entry of Object.entries(a)) {
        const [key, val] = entry;

        if (key in b) {
            const aVal = a[key],
                bVal = b[key];

            if (
                typeof aVal === "object" &&
                aVal !== null &&
                !Array.isArray(aVal) &&
                typeof bVal === "object" &&
                bVal !== null &&
                !Array.isArray(bVal)
            ) {
                merged[key] = mergeJSONObjects(aVal, bVal);
                continue;
            }
        }

        merged[key] = val;
    }

    for (const entry of Object.entries(b)) {
        const [key, val] = entry;

        if (key in b) {
            const aVal = a[key],
                bVal = b[key];

            if (typeof aVal === "object" && aVal !== null && !Array.isArray(aVal)) {
                if (typeof bVal === "object" && bVal !== null && !Array.isArray(bVal)) {
                    continue;
                }
            }
        }

        if (Array.isArray(val)) {
            merged[key] = cloneJSONArray(val);
            continue;
        }

        merged[key] = val;
    }

    return merged as TypeJSONObject;
}
