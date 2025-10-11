import { ObjectId } from "mongodb";

export interface User {
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

export interface UserResponse {
    _id: string;
    email: string;
    name: string;
    isVerified: boolean;
    createdAt: Date;
}
