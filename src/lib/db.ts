import { MongoClient } from "mongodb";
import { Globals } from "@/globals/backend";

const mongoClient = new MongoClient(Globals.env.mongoDB.CONNECTION_URI, { appName: Globals.appInfo.name });
mongoClient.connect();

export { mongoClient };
