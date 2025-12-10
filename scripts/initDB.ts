import fs from "fs";
import z, { email } from "zod";
import dotenv from "dotenv";
/*
dotenv.config({
    path: ".env.local",
});
*/
import { Db, MongoClient } from "mongodb";
import { url } from "inspector";
import { JSONSchema } from "zod/v4/core";

function configureEnvVariables() {
    const files = fs.readdirSync(".");
    const envFiles = files.filter((fileName) => fileName.startsWith(".env") || fileName.endsWith(".env"));

    if (envFiles.length === 0) {
        console.error("No env files found (starting or ending with .env)");
    }

    const filteredEnvFileNames = envFiles.map((fileName) => {
        let filteredFileName = fileName;

        if (filteredFileName.startsWith(".env")) {
            filteredFileName = filteredFileName.slice(4);
        }

        if (filteredFileName.endsWith(".env")) {
            filteredFileName = filteredFileName.slice(0, -4);
        }

        return { fileName, filteredFileName };
    });

    const fileTokens = filteredEnvFileNames.map(({ fileName, filteredFileName }) => {
        if (filteredFileName === ".") {
            return { fileName, tokens: [""] };
        }

        const tokens: string[] = [];
        let tokenChars: string[] = [];

        for (let i = 0; i < filteredFileName.length; i++) {
            if (/[a-zA-Z0-9]/.test(filteredFileName[i])) {
                tokenChars.push(filteredFileName[i]);
            } else {
                if (tokenChars.length === 0) {
                    continue;
                }

                tokens.push(tokenChars.join(""));
                tokenChars = [];
            }
        }

        if (tokenChars.length !== 0) {
            tokens.push(tokenChars.join(""));
        }

        return { fileName, tokens };
    });

    const envTypes = [
        { type: "local/development", tokens: ["", "local", "dev", "development"] },
        { type: "sandbox", tokens: ["sandbox", "sbx"] },
        { type: "test", tokens: ["test", "testing"] },
        { type: "integration", tokens: ["integration", "int"] },
        { type: "qa", tokens: ["qa", "quality-assurance"] },
        { type: "performance", tokens: ["perf", "performance"] },
        { type: "user-acceptance-testing", tokens: ["uat", "user-acceptance-testing"] },
        { type: "demo", tokens: ["demo", "demonstration"] },
        { type: "preview", tokens: ["preview", "pre"] },
        { type: "alpha", tokens: ["alpha"] },
        { type: "beta", tokens: ["beta"] },
        { type: "staging", tokens: ["stg", "stage", "staging"] },
        { type: "canary", tokens: ["canary", "cny"] },
        { type: "hotfix", tokens: ["hotfix", "hfx"] },
        { type: "training", tokens: ["training", "trn"] },
        { type: "disaster-recovery", tokens: ["dr", "disaster-recovery"] },
        { type: "production", tokens: ["prod", "production"] },
    ];

    // const foundEnvTypes: string[] = [];

    const foundEnvTypes = fileTokens
        .map(({ fileName, tokens }) => {
            let envIndex = -1;

            for (let i = 0; i < envTypes.length; i++) {
                for (let j = 0; j < envTypes[i].tokens.length; j++) {
                    for (const token of tokens) {
                        if (token === envTypes[i].tokens[j]) {
                            envIndex = i;
                        }
                    }
                }
            }

            if (envIndex == -1) {
                return;
            }

            return { fileName, envIndex };
        })
        .filter((val) => val != null)
        .sort((a, b) => a.envIndex - b.envIndex);

    foundEnvTypes.forEach(({ fileName, envIndex }, index) => {
        console.log(`${index}) Env file: '${fileName}', type: '${envTypes[envIndex].type}'`);
    });

    const chosenEnvType = foundEnvTypes[0];
    console.log(`Continuing with file '${chosenEnvType.fileName}'`);

    dotenv.config({ path: `${chosenEnvType.fileName}`, quiet: true });
}

(function init() {
    configureEnvVariables();
    const envSchema = z.object({
        MONGODB_URI: z.url({ protocol: /(mongodb)|(mongodb+srv)/ }),
    });

    const env = envSchema.parse(process.env);
    (async function () {
        const client = await MongoClient.connect(env.MONGODB_URI);

        const registryDB: Db = client.db("registry");

        const userIndexes = await registryDB
            .collection("users")
            .createIndexes([{ key: { email: 1 }, unique: true, name: "email" }]);
        console.log("mUserCollection indexNames:", userIndexes.join(", "));

        const emailVfTokenIndexes = await registryDB.collection("emailVfTokens").createIndexes([
            { key: { userID: 1 }, unique: true, name: "userID" },
            { key: { email: 1 }, unique: true, name: "email" },
        ]);
        console.log("mEmailVfToken indexNames:", emailVfTokenIndexes.join(", "));

        await client.close();
    })();
})();
