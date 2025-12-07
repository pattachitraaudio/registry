import fs from "fs";
import dotenv from "dotenv";
import { FileQuestionMark } from "lucide-react";

/*
dotenv.config({
    path: ".env.local",
});
*/
// import { MongoClient } from "mongodb";

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
        ["local", "dev", "development"],
        ["sandbox", "sbx"],
        ["test", "testing"],
        ["integration", "int"],
        ["qa", "quality-assurance"],
        ["perf", "performance"],
        ["uat", "user-acceptance-testing"],
        ["demo", "demonstration"],
        ["preview", "pre"],
        ["alpha"],
        ["beta"],
        ["stg", "stage", "staging"],
        ["canary", "cny"],
        ["hotfix", "hfx"],
        ["training", "trn"],
        ["dr", "disaster-recovery"],
        ["prod", "production"],
        [""],
    ];

    const foundEnvTypes: string[] = [];

    for (let i = 0; i < envTypes.length; i++) {
        for (let j = 0; j < envTypes[i].length; j++) {
            for (const token of fileTokens) {
                if (token === envTypes[i][j]) {
                }
            }
        }
    }
}

configureEnvVariables();
