import { ObjectId } from "mongodb";

export interface MUser {
    _id: ObjectId;
    email: string;
    password: string;
    name: string;
    isVerified: boolean;
    createdAt: Date;
    referredBy: ObjectId;
    referralCode: string;
    accountSuspended?: boolean;
    permissions: Record<string, boolean>;
}

// verificationToken?: string;
// verificationTokenExpiry?: Date;
// accountsRedeemed: number; // Total number of accounts redeemed by user

/*
class MUser {
    isVerified: boolean;
    createdAt: Date;
    constructor(
        public _id: ObjectId,
        public email: string,
        public password: string,
        public name: string,
    ) {
        this.isVerified = false,
        this.createdAt = new Date();
    }
}
export { MUser };

*/
