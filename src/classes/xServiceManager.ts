import { MongoClient } from "mongodb";
import { EnvManager, EnvMap } from "./xEnvManager";
import { CookieManager } from "./xCookieManager";
import { CONSTANT } from "@/constant";

interface Service {
    env: EnvMap;
    mongoDBClient: MongoClient;
    cookieManager: CookieManager;
}

export class ServiceManager {
    private static instance: null | ServiceManager;
    private setupPromise!: null | Promise<Service>;

    constructor() {
        if (ServiceManager.instance) {
            return ServiceManager.instance;
        }

        return (ServiceManager.instance = this.createInstance());
    }

    private createInstance() {
        return this;
    }

    async setup(): Promise<Service> {
        if (this.setupPromise) {
            return this.setupPromise;
        }

        return (this.setupPromise = (async function () {
            try {
                const envManager = new EnvManager();
                const env = await envManager.setup();

                const mongoDBClient = await new MongoClient(env.MONGODB_URI, {
                    appName: CONSTANT.appInfo.name,
                }).connect();

                const cookieManager = await new CookieManager(env.JWT_SECRET, env.ENV_TYPE).setup(mongoDBClient);

                return { env, mongoDBClient, cookieManager };
            } catch (err) {
                console.log("@<< FATAL ERROR >>@");

                if (err instanceof Error) {
                    console.error(err.stack);
                } else {
                    console.log(err);
                }

                process.exit(4);
            }
        })());
    }
}
