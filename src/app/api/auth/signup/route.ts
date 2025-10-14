import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import crypto from "crypto";
import { MUser } from "@/models/MUser";
import { Globals } from "@/config/globals";
import { sendVerificationEmail } from "@/lib/email";
import zod from "zod";
import { ErrorResponse } from "@/interfaces/APIResponses/ErrorResponse";
import { APIResponseCode } from "@/app/enums/APIResponseCode";
import { UserResponse } from "@/interfaces/APIResponses/UserResponse";
import { ObjectId } from "mongodb";
import { GenericErrorResponse } from "@/interfaces/APIResponses/GenericErrorResponse";

const SignUpUser = zod.object({
    name: zod
        .string()
        .min(2, "Name must be at least 2 characters")
        .max(50, "Name must not exceed 50 characters")
        .trim(),

    email: zod
        .email("Invalid email address")
        .toLowerCase()
        .trim()
        .regex(
            /^[a-z0-9]+@/,
            "Email username must contain only letters and numbers (no dots, underscores, or special characters)",
        )
        .regex(
            /@[a-z0-9]+\./,
            "Email domain must contain only letters and numbers (no underscores or special characters)",
        )
        .regex(/^[^.]*@[^.]*\.[^.]*$/, "Email must not contain subdomains (format: username@domain.tld)")
        .regex(/@[a-z0-9]+\.[a-z]{2,}$/, "Email must end with a valid TLD (e.g., .com, .org)"),

    password: zod
        .string()
        .refine(
            (password): boolean =>
                password.length >= 8 &&
                password.length <= 64 &&
                /[A-Z]/.test(password) &&
                /[a-z]/.test(password) &&
                /[0-9]/.test(password) &&
                /[^A-Za-z0-9]/.test(password),
            {
                message:
                    "Password must be 8 to 64 characters in length and must contain at least one uppercase letter, one lowercase letter, one number, and one special character",
            },
        ),
    /*
        .min(8, "Password must be at least 8 characters")
        .max(64, "Password must not exceed 64 characters")
        .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
        .regex(/[a-z]/, "Password must contain at least one lowercase letter")
        .regex(/[0-9]/, "Password must contain at least one number")
        .regex(/[^A-Za-z0-9]/, "Password must contain at least one special character"),
        */
});

export async function POST(request: Request): Promise<NextResponse<GenericErrorResponse> | NextResponse<UserResponse>> {
    try {
        try {
            const { email, password, name } = SignUpUser.parse(await request.json());
            const users = Globals.mongoDB.users();

            const existingUser = await users.findOne({ email });

            if (existingUser) {
                return NextResponse.json(
                    { status: APIResponseCode.GENERIC_ERROR, message: "User already exists" },
                    { status: 409 },
                );
            }

            const hashedPassword = await bcrypt.hash(password, 10);

            // Generate verification token
            const emailVerificationToken = new ObjectId(crypto.randomBytes(12));
            const emailVerificationTokenExpirySeconds = 15 * 60; // 15 minutes

            const createdAt = new Date();

            const user: MUser = {
                email,
                password: hashedPassword,
                name,
                isVerified: false,
                accountsRedeemed: 0,
                createdAt,
            };

            const result = await users.insertOne(user, {});

            Globals.mongoDB.emailVerificationTokens().insertOne(
                {
                    _id: emailVerificationToken,
                    userID: result.insertedId,
                    createdAt,
                    expiry: new Date(createdAt.getTime() + emailVerificationTokenExpirySeconds * 1000),
                },
                {},
            );

            // Send verification email
            sendVerificationEmail(
                email,
                name,
                emailVerificationToken.toHexString(),
                emailVerificationTokenExpirySeconds,
            ).then((success) => {
                if (!success) {
                    console.error("[[ ERROR ]] Failed to send verification email");
                }
            });

            return NextResponse.json(
                {
                    status: APIResponseCode.SUCCESS,
                    message: "User created successfully | Please check your email to verify your account",
                    data: {
                        id: result.insertedId.toString(),
                        email,
                        name,
                    },
                },
                { status: 201 },
            );
        } catch (err) {
            if (err instanceof zod.ZodError) {
                return NextResponse.json(
                    { status: APIResponseCode.GENERIC_ERROR, message: err.issues[0].message },
                    { status: 400 },
                );
            }

            throw err;
        }
    } catch (err) {
        console.error("[[ ERROR ]] Sign up error:", err);
        if (err instanceof SyntaxError) {
            return NextResponse.json({ status: APIResponseCode.GENERIC_ERROR, message: err.message }, { status: 400 });
        }

        return NextResponse.json(
            { status: APIResponseCode.GENERIC_ERROR, message: "Internal server error" },
            { status: 500 },
        );
    }
}
