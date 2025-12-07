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

/*
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
*/

export type tJObject = {
    [key: string]: tJObject | tJArray | number | string | boolean;
};

export type tJArray = (tJObject | tJArray | number | string | boolean)[];
export type tJSON = tJObject | tJArray | number | string | boolean;

export function cloneJSONObject(o: tJObject) {
    const clone: tJObject = {};
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

export function cloneJSONArray(a: tJArray) {
    const clone: tJArray = [];

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

export function mergeJSONObjects(a: tJObject, b: tJObject): tJObject {
    const merged: tJObject = {};

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

    return merged as tJObject;
}

export type PrettifyObject<T extends object> = {
    [Key in keyof T]: T[Key] extends object ? PrettifyObject<T[Key]> : T[Key];
} & {};

declare const brand: unique symbol;
export type Brand<T, Brand extends string> = T & { [brand]: Brand };
