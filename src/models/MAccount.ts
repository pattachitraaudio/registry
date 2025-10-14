import { ObjectId } from "mongodb";

export interface MAccount {
    _id: string;
    userID: ObjectId;
    email: string;
    password: string;
    apiKey: string;
    createdOn: Date;
}
