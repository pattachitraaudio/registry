export const accountProviders = {
    elevenLabs: "ElevenLabs",
    backblazeB2: "Backblaze B2",
    cloudflareR2: "Cloudflare R2",
    mongoDB: "Mongo DB",
} as const;

type StringToNumber<T extends string> = T extends `${infer N extends number}` ? N : never;
export type ArrayIndices<T extends readonly unknown[]> = StringToNumber<Exclude<Exclude<keyof T, keyof []>, symbol>>;

// export type AccountIndex = ArrayIndices<typeof >;
// export type AccountProviderValue = (typeof accounts)[number]["value"];
