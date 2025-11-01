import { ObjectId } from "mongodb";

export interface MElevenlabsAccount {
    _id: string;
    email: string;
    password: string;
    apiKey: string;
    createdByuserID: ObjectId;
    createdOn: Date;
}
