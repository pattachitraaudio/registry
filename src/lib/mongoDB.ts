import { MAccount } from "@/models/MAccount";
import { MDeletedAccount } from "@/models/MDeletedAccount";
import { MEmailVerificationToken } from "@/models/MEmailVerificationToken";
import { MUser } from "@/models/MUser";
import { Collection, Document, Db, MongoClient } from "mongodb";

class MongoDB {
    client: MongoClient;
    clientPromise: Promise<MongoClient>;

    constructor(private dbName: string) {
        const uri = process.env.MONGODB_URI;

        if (!uri) {
            throw new Error('Invalid/Missing environment variable: "MONGODB_URI"');
        }

        this.client = new MongoClient(uri);
        this.clientPromise = this.client.connect();
    }

    collection<T extends Document>(collectionName: string) {
        const self = this;

        const collectionPromise = new Promise(function executor(resolve: (value: Collection<T>) => void, reject): void {
            (async function () {
                try {
                    const db = (await self.clientPromise).db(self.dbName);
                    resolve(db.collection(collectionName));
                } catch (err) {
                    reject(err);
                }
            })();
        });

        return new Proxy({} as Collection<T>, {
            get(_, prop: keyof Collection<T>) {
                if (prop === "db") {
                    return;
                }

                if (prop === "dbName") {
                    return self.dbName;
                }

                if (prop === "collectionName") {
                    return collectionName;
                }

                if (prop === "namespace") {
                    return `${self.dbName}.${collectionName}`;
                }

                if (
                    prop === "readConcern" ||
                    prop === "readPreference" ||
                    prop === "bsonOptions" ||
                    prop === "writeConcern" ||
                    prop === "timeoutMS"
                ) {
                    return self.client[prop];
                }

                return async function wrapper(...args: unknown[]) {
                    const collection = await collectionPromise;
                    const method = collection[prop];

                    if (typeof method === "function") {
                        return await (method as (...args: unknown[]) => void).apply(collection, args);
                    }
                };
            },
        });
    }

    users() {
        return this.collection<MUser>("users");
    }

    accounts() {
        return this.collection<MAccount>("accounts");
    }

    deletedAccounts() {
        return this.collection<MDeletedAccount>("deletedAccounts");
    }

    emailVerificationTokens() {
        return this.collection<MEmailVerificationToken>("emailVerificationTokens");
    }
}

export { MongoDB };
