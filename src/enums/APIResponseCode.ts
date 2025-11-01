import { flatten, invertObjectKV } from "@/lib/enum";

export const APIResponseCode = {
    SUCCESS: 0,
    WORK_IN_PROGRESS: 2,
    Error: {
        UNKNOWN_ERROR: 1,

        // --- SIGNUP ERRORS (40 - 79) ---
        SignUp: {
            Form: {
                Email: {
                    EMAIL_NOT_PRESENT: 40,
                    EMAIL_NOT_A_STRING: 41,
                    INVALID_USERNAME: 42,
                    INVALID_DOMAIN_NAME: 43,
                    FAILED_TO_VALIDATE_EMAIL: 44, // Original: 44
                    INVALID_EMAIL_CHARACTERS: 45,
                    EMAIL_TOO_SHORT: 46,
                    EMAIL_TOO_LONG: 47,
                },
                Name: {
                    NAME_NOT_PRESENT: 75,
                    NAME_NOT_A_STRING: 76,
                    NAME_TOO_SHORT: 77,
                    NAME_TOO_LONG: 78,
                    FAILED_TO_VALIDATE_NAME: 79,
                },
                Password: {
                    PASSWORD_NOT_PRESENT: 54,
                    PASSWORD_NOT_A_STRING: 65, // Kept 65 as primary for this error type
                    PASSWORD_TOO_SHORT: 55,
                    PASSWORD_TOO_LONG: 56,
                    PASSWORD_MISSING_LOWERCASE: 57,
                    PASSWORD_MISSING_UPPERCASE: 58,
                    PASSWORD_MISSING_NUMBER: 59,
                    PASSWORD_MISSING_SPECIAL_CHARACTER: 63,
                    FAILED_TO_VALIDATE_PASSWORD: 64,
                },
                ReferralCode: {
                    REFERRAL_CODE_NOT_PRESENT: 544,
                    REFERRAL_CODE_NOT_A_STRING: 127, // Changed from 65 (Duplicate with Password)
                    REFERRAL_CODE_NOT_START_WITH_REF: 2343,
                    INVALID_REFERRAL_CODE_LENGTH: 235,
                    FAILED_TO_VALIDATE_REFERRAL_CODE: 53,
                },
            },
            Captcha: {
                CAPTCHA_NOT_PRESENT: 62,
                CAPTCHA_NOT_A_STRING: 234,
                CAPTCHA_FAILED: 60,
            },
            EMAIL_ALREADY_EXISTS: 61,
            DATABASE_ERROR: 70,
            REFERRAL_CODE_NOT_FOUND: 434,
            MAX_SIGNUP_ATTEMPTS_EXCEEDED: 71,
            SIGNUP_DISABLED_BY_POLICY: 344,
        },

        // --- VERIFY EMAIL ERRORS (429-1000) ---
        VerifyEmail: {
            VfToken: {
                NOT_PRESENT: 429,
                NOT_A_STRING: 432,
                INVALID_LENGTH: 431,
                NON_HEX_CHARACTER: 430,
            },
            VERIFICATION_TOKEN_EXPIRED: 999,
            VERIFICATION_TOKEN_NOT_FOUND: 89,
            USER_NOT_FOUND: 1000,
        },

        // --- LOGIN ERRORS (90, 93, 110-126, 9800) ---
        Login: {
            Form: {
                // Form validation codes are unique and start at 110 to avoid conflicts
                // with SignUp (40-64)
                Email: {
                    EMAIL_NOT_PRESENT: 110, // Changed from 40
                    EMAIL_NOT_A_STRING: 111, // Changed from 41
                    INVALID_USERNAME: 112, // Changed from 42
                    INVALID_DOMAIN_NAME: 113, // Changed from 43
                    INVALID_EMAIL_CHARACTERS: 114, // Changed from 45
                    EMAIL_TOO_SHORT: 115, // Changed from 46
                    EMAIL_TOO_LONG: 116, // Changed from 47
                    FAILED_TO_VALIDATE_EMAIL: 117, // Changed from 44
                },
                Password: {
                    PASSWORD_NOT_PRESENT: 118, // Changed from 54
                    PASSWORD_NOT_A_STRING: 119, // Changed from 65
                    PASSWORD_TOO_SHORT: 120, // Changed from 55
                    PASSWORD_TOO_LONG: 121, // Changed from 56
                    PASSWORD_MISSING_LOWERCASE: 122, // Changed from 57
                    PASSWORD_MISSING_UPPERCASE: 123, // Changed from 58
                    PASSWORD_MISSING_NUMBER: 124, // Changed from 59
                    PASSWORD_MISSING_SPECIAL_CHARACTER: 125, // Changed from 63
                    FAILED_TO_VALIDATE_PASSWORD: 126, // Changed from 64
                },
            },
            INCORRECT_PASSWORD: 93,
            EMAIL_NOT_FOUND: 90,
            EMAIL_NOT_VERIFIED: 9800,
        },

        // --- SESSION ERRORS (100-104) ---
        Session: {
            JWT: {
                INVALID: 100,
                CLAIM_VALIDATION_FAILED: 9343,
                DECRYPTION_FAILED: 399,

                EXPIRED: 101,
                NOT_PRESENT: 103,
                JWE: {},
                JOSE: {
                    JOSE_ALGO_NOT_ALLOWED: 4923,
                },
            },
            USER_NOT_FOUND: 104,
        },
        Logout: {
            JWT: {
                INVALID: 100,
                CLAIM_VALIDATION_FAILED: 9343,
                DECRYPTION_FAILED: 399,

                EXPIRED: 101,
                NOT_PRESENT: 103,
                JWE: {},
                JOSE: {
                    JOSE_ALGO_NOT_ALLOWED: 4923,
                },
            },
            USER_NOT_FOUND: 104,
        },

        Account: {
            Elevenlabs: {
                Create: {},
                Update: {},
                Delete: {},
                Get: {},
            },
        },
    },
} as const;
/*
export const APIResponseCode = {
    SUCCESS: 0,
    Error: {
        UNKNOWN_ERROR: 1,

        SignUp: {
            Form: {
                Email: {
                    EMAIL_NOT_PRESENT: 40,
                    EMAIL_NOT_A_STRING: 41,

                    INVALID_USERNAME: 42,
                    INVALID_DOMAIN_NAME: 43,
                    INVALID_EMAIL_CHARACTERS: 45,
                    EMAIL_TOO_SHORT: 46,
                    EMAIL_TOO_LONG: 47,

                    FAILED_TO_VALIDATE_EMAIL: 44,
                },
                Name: {
                    NAME_NOT_PRESENT: 75,
                    NAME_NOT_A_STRING: 76,

                    NAME_TOO_SHORT: 77,
                    NAME_TOO_LONG: 78,

                    FAILED_TO_VALIDATE_NAME: 79,
                },
                Password: {
                    PASSWORD_NOT_PRESENT: 54,
                    PASSWORD_NOT_A_STRING: 65,

                    PASSWORD_TOO_SHORT: 55,
                    PASSWORD_TOO_LONG: 56,
                    PASSWORD_MISSING_LOWERCASE: 57,
                    PASSWORD_MISSING_UPPERCASE: 58,
                    PASSWORD_MISSING_NUMBER: 59,
                    PASSWORD_MISSING_SPECIAL_CHARACTER: 63,

                    FAILED_TO_VALIDATE_PASSWORD: 64,
                },
                ReferralCode: {
                    REFERRAL_CODE_NOT_PRESENT: 544,
                    REFERRAL_CODE_NOT_A_STRING: 65,

                    REFERRAL_CODE_NOT_START_WITH_REF: 2343,
                    INVALID_REFERRAL_CODE_LENGTH: 235,

                    FAILED_TO_VALIDATE_REFERRAL_CODE: 53,
                },
            },
            Captcha: {
                CAPTCHA_NOT_PRESENT: 62,
                CAPTCHA_NOT_A_STRING: 234,

                CAPTCHA_FAILED: 60,
            },
            EMAIL_ALREADY_EXISTS: 61,
            DATABASE_ERROR: 70,
            REFERRAL_CODE_NOT_FOUND: 434,
            MAX_SIGNUP_ATTEMPTS_EXCEEDED: 71,
            SIGNUP_DISABLED_BY_POLICY: 344,
        },
        VerifyEmail: {
            VerificationToken: {
                NOT_PRESENT: 429,
                NOT_A_STRING: 432,
                INVALID_LENGTH: 431,
                NON_HEX_CHARACTER: 430,
                // FAILED_TO_VALIDATE_VERIFICATION_TOKEN:
            },

            VERIFICATION_TOKEN_EXPIRED: 999,
            VERIFICATION_TOKEN_NOT_FOUND: 89,
            USER_NOT_FOUND: 1000,
        },
        Login: {
            Form: {
                Email: {
                    EMAIL_NOT_PRESENT: 40,
                    EMAIL_NOT_A_STRING: 41,

                    INVALID_USERNAME: 42,
                    INVALID_DOMAIN_NAME: 43,
                    INVALID_EMAIL_CHARACTERS: 45,
                    EMAIL_TOO_SHORT: 46,
                    EMAIL_TOO_LONG: 47,

                    FAILED_TO_VALIDATE_EMAIL: 44,
                },
                Password: {
                    PASSWORD_NOT_PRESENT: 54,
                    PASSWORD_NOT_A_STRING: 65,

                    PASSWORD_TOO_SHORT: 55,
                    PASSWORD_TOO_LONG: 56,
                    PASSWORD_MISSING_LOWERCASE: 57,
                    PASSWORD_MISSING_UPPERCASE: 58,
                    PASSWORD_MISSING_NUMBER: 59,
                    PASSWORD_MISSING_SPECIAL_CHARACTER: 63,

                    FAILED_TO_VALIDATE_PASSWORD: 64,
                },
            },
            INCORRECT_PASSWORD: 93,
            EMAIL_NOT_FOUND: 90,
            EMAIL_NOT_VERIFIED: 9800,
        },
        // CheckEmailError: {},
        Session: { INVALID_JWT: 100, JWT_EXPIRED: 101, NO_JWT: 103, USER_NOT_FOUND: 104 },
    },
    WORK_IN_PROGRESS: 2,
} as const;
 */

export const APIResponseCodeFlat = flatten(APIResponseCode);
export const APIResponsePhraseMap = invertObjectKV(flatten({ APIResponseCode }));
