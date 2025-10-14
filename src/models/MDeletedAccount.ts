import { ObjectId } from "mongodb";
import { MAccount } from "./MAccount";

export interface MDeletedAccount extends MAccount {
    _id: string;
    userID: ObjectId;
    email: string;
    password: string;
    apiKey: string;
    createdOn: Date;
    deletedOn: Date;
}
