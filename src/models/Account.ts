import { ObjectId } from "mongodb";

export interface Account {
    _id?: ObjectId;
    userId: ObjectId;
    email: string;
    password: string;
    apiKey: string;
    validationData?: any; // Data returned from API validation
    isActive: boolean;
    createdAt: Date;
    updatedAt: Date;
}

export interface AccountResponse {
    _id: string;
    email: string;
    apiKey: string;
    isActive: boolean;
    validationData?: any;
    createdAt: Date;
    updatedAt: Date;
}
