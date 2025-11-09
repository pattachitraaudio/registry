import { ObjectId } from "mongodb";

export interface mElevenlabsAccount {
    _id: string;
    email: string;
    password: string;
    apiKey: string;
    createdByUserID: ObjectId;
    createdOn: Date;
}
