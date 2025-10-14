import { ObjectId } from "mongodb";

export interface MUser {
    _id?: ObjectId;
    email: string;
    password: string;
    name: string;
    isVerified: boolean;
    verificationToken?: string;
    verificationTokenExpiry?: Date;
    accountsRedeemed: number; // Total number of accounts redeemed by user
    createdAt: Date;
}
