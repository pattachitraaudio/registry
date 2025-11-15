// Configuration constants for the application

export const ACCOUNT_VALUE_INR = 2;

// Currency symbol
export const CURRENCY_SYMBOL = "₹";

// Format currency value
export function formatCurrency(value: number): string {
    return `${CURRENCY_SYMBOL}${value.toFixed(2)}`;
}

import { execSync } from "node:child_process";
import packageJSON from "../../package.json" with { type: "json" };

function getGitCommitSHA(): string {
    try {
        return execSync("git rev-parse HEAD").toString().trim();
    } catch {
        console.error("Failed to retreive git commit SHA");
        return "0".repeat(40);
    }
}

export const CONSTANT = {
    appInfo: {
        name: packageJSON.name,
        version: packageJSON.version,
        fullName: "Pattachitra Audio Registry",
        description: packageJSON.description,
        repository: packageJSON.repository,
        commitSHA: getGitCommitSHA(),
    },
    /* TODO: Unified db/collection names
    config: {
        db: {
            registry: {
                name: "registry",
                collection: {
                    emailVfTokens: "emailVfTokens",
                    users: "users",
                },
            },
            accounts: {
                name: "accounts",
                
            }
        },
    },
    */
} as const;

// console.log(Globals);
