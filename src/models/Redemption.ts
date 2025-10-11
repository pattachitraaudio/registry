import { ObjectId } from "mongodb";

export interface Redemption {
    _id?: ObjectId;
    userId: ObjectId;
    accountsRedeemed: number; // Number of accounts redeemed in this transaction
    totalValue: number; // Total price in INR
    redeemedAt: Date; // Timestamp of redemption
}

export interface RedemptionResponse {
    _id: string;
    accountsRedeemed: number;
    totalValue: number;
    redeemedAt: Date;
}
