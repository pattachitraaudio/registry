import { ObjectId } from "mongodb";

export interface MEmailVerificationToken {
    _id: ObjectId;
    userID: ObjectId;
    createdAt: Date;
    expiry: Date;
}
