import { Flatten, ValueOf, flatten, invertObjectKV } from "@/lib/enum";

export const APIResCode = {
    // --- GLOBAL STATUS (0 - 9) ---
    SUCCESS: 0,
    WORK_IN_PROGRESS: 1,

    Error: {
        UNKNOWN_ERROR: 2,
        DB_CONNECTION_FAILED: 3,
        DB_ERROR: 4,

        BRAND: {
            EMAIL: {
                NOT_PRESENT: 2100,
                NOT_A_STRING: 2101,
                INVALID_USERNAME: 2102,
                INVALID_DOMAIN_NAME: 2103,
                INVALID_EMAIL_CHARACTERS: 2104,
                TOO_SHORT: 2105,
                TOO_LONG: 2106,
                FAILED: 2107,
            },
            PASSWORD: {
                NOT_PRESENT: 2120,
                NOT_A_STRING: 2121,
                TOO_SHORT: 2122,
                TOO_LONG: 2123,
                MISSING_LOWERCASE: 2124,
                MISSING_UPPERCASE: 2125,
                MISSING_NUMBER: 2126,
                MISSING_SPECIAL_CHARACTER: 2127,
                FAILED: 2128,
            },
            CAPTCHA: {
                CAPTCHA_NOT_PRESENT: 2140,
                CAPTCHA_NOT_A_STRING: 2141,
                CAPTCHA_FAILED: 2142,
            },
            REFERRAL_CODE: {
                PRESENT: 130,
                A_STRING: 131,
                START_WITH_REF: 132,
                INVALID_REFERRAL_CODE_LENGTH: 133,
                FAILED: 134,
            },
        },
        // --- SIGNUP ERRORS (100 - 199) ---
        SignUp: {
            Form: {
                Email: {
                    NOT_PRESENT: 100,
                    NOT_A_STRING: 101,
                    INVALID_USERNAME: 102,
                    INVALID_DOMAIN_NAME: 103,
                    INVALID_EMAIL_CHARACTERS: 104,
                    TOO_SHORT: 105,
                    TOO_LONG: 106,
                    FAILED: 107,
                },
                Name: {
                    NOT_PRESENT: 110,
                    NOT_A_STRING: 111,
                    TOO_SHORT: 112,
                    TOO_LONG: 113,
                    FAILED: 114,
                },
                Password: {
                    NOT_PRESENT: 120,
                    NOT_A_STRING: 121,
                    TOO_SHORT: 122,
                    TOO_LONG: 123,
                    MISSING_LOWERCASE: 124,
                    MISSING_UPPERCASE: 125,
                    MISSING_NUMBER: 126,
                    MISSING_SPECIAL_CHARACTER: 127,
                    FAILED: 128,
                },
                ReferralCode: {
                    PRESENT: 130,
                    A_STRING: 131,
                    START_WITH_REF: 132,
                    INVALID_REFERRAL_CODE_LENGTH: 133,
                    FAILED: 134,
                },
            },
            Captcha: {
                CAPTCHA_NOT_PRESENT: 140,
                CAPTCHA_NOT_A_STRING: 141,
                CAPTCHA_FAILED: 142,
            },
            EMAIL_ALREADY_EXISTS: 150,
            DATABASE_ERROR: 151,
            REFERRAL_CODE_NOT_FOUND: 152,
            MAX_SIGNUP_ATTEMPTS_EXCEEDED: 153,
            SIGNUP_DISABLED_BY_POLICY: 154,
        },

        // --- VERIFY EMAIL ERRORS (200 - 299) ---
        VerifyEmail: {
            VfToken: {
                NOT_PRESENT: 200,
                NOT_A_STRING: 201,
                INVALID_LENGTH: 202,
                NON_HEX_CHARACTER: 203,
            },
            VERIFICATION_TOKEN_EXPIRED: 210,
            VERIFICATION_TOKEN_NOT_FOUND_IN_DB: 211,
            USER_NOT_FOUND: 212,
        },

        // --- LOGIN ERRORS (300 - 399) ---
        Login: {
            Form: {
                Email: {
                    NOT_PRESENT: 300,
                    NOT_A_STRING: 301,
                    USERNAME: 302,
                    INVALID_DOMAIN_NAME: 303,
                    INVALID_EMAIL_CHARACTERS: 304,
                    TOO_SHORT: 305,
                    TOO_LONG: 306,
                    FAILED: 307,
                },
                Password: {
                    NOT_PRESENT: 310,
                    NOT_A_STRING: 311,
                    TOO_SHORT: 312,
                    TOO_LONG: 313,
                    MISSING_LOWERCASE: 314,
                    MISSING_UPPERCASE: 315,
                    MISSING_NUMBER: 316,
                    MISSING_SPECIAL_CHARACTER: 317,
                    FAILED: 318,
                },
            },
            INCORRECT_PASSWORD: 320,
            EMAIL_NOT_FOUND: 321,
            EMAIL_NOT_VERIFIED: 322,
        },

        // --- SESSION ERRORS (400 - 449) ---
        Session: {
            JWT: {
                INVALID: 400,
                CLAIM_VALIDATION_FAILED: 401,
                DECRYPTION_FAILED: 402,
                EXPIRED: 403,
                NOT_PRESENT: 404,
                JWE: {},
                JOSE: {
                    JOSE_ALGO_NOT_ALLOWED: 405,
                },
            },
            USER_NOT_FOUND: 406,
        },

        ResendVfEmail: {
            USER_NOT_FOUND: 420,
            USER_ALREADY_VERIFIED: 421,
            RATE_LIMIT_EXCEEDED: 422,
        },

        // --- LOGOUT ERRORS (450 - 499) ---
        Logout: {
            JWT: {
                INVALID: 450,
                CLAIM_VALIDATION_FAILED: 451,
                DECRYPTION_FAILED: 452,
                EXPIRED: 453,
                NOT_PRESENT: 454,
                JWE: {},
                JOSE: {
                    JOSE_ALGO_NOT_ALLOWED: 455,
                },
            },
            USER_NOT_FOUND: 456,
        },

        // --- ACCOUNT / ELEVENLABS ERRORS (500+) ---
        Account: {
            ElevenLabs: {
                Add: {
                    Form: {
                        APIKey: {
                            NOT_PRESENT: 500,
                            NOT_A_STRING: 501,
                            INVALID_PREFIX: 502,
                            INVALID_LENGTH: 503,
                            INVALID_FORMAT: 504,
                        },
                        // Reusing validation logic usually implies unique codes per context
                        // giving these unique IDs in the 510-520 range
                        Email: {
                            NOT_PRESENT: 510,
                            NOT_A_STRING: 511,
                            INVALID_USERNAME: 512,
                            INVALID_DOMAIN_NAME: 513,
                            INVALID_EMAIL_CHARACTERS: 514,
                            TOO_SHORT: 515,
                            TOO_LONG: 516,
                            FAILED_TO_VALIDATE_EMAIL: 517,
                        },
                        Password: {
                            NOT_PRESENT: 520,
                            NOT_A_STRING: 521,
                            TOO_SHORT: 522,
                            TOO_LONG: 523,
                            MISSING_LOWERCASE: 524,
                            MISSING_UPPERCASE: 525,
                            MISSING_NUMBER: 526,
                            MISSING_SPECIAL_CHARACTER: 527,
                            FAILED_TO_VALIDATE_PASSWORD: 528,
                        },
                    },
                    ElevenLabsAPI: {
                        UNPROCESSABLE_ENTITY: 530,
                        INVALID_API_KEY: 531,
                        UNKNOWN: 532,
                    },
                    ACCOUNT_ID_ALREADY_EXISTS: 533,
                },
                Update: {},
                Delete: {
                    Params: {
                        ID: {
                            NOT_PRESENT: 540,
                            TOO_SHORT: 541,
                            TOO_LONG: 542,
                            INVALID_CHARACTER_FOUND: 543,
                        },
                    },
                    ACCOUNT_ID_NOT_FOUND: 544,
                },
                Get: {},
            },
        },
    },
} as const;

export const APIResCodeFlat = flatten(APIResCode);
export const APIResPhraseMap = invertObjectKV(flatten({ APIResCode }));

export type tAPIResCode = ValueOf<Flatten<typeof APIResCode>>;

export function getErrMessageFromAPIResCode(code: tAPIResCode): string {
    switch (code) {
        // --- GLOBAL STATUS ---
        case APIResCode.SUCCESS:
            return "Operation successful";
        case APIResCode.WORK_IN_PROGRESS:
            return "This feature is currently work in progress";

        // --- GLOBAL ERRORS ---
        case APIResCode.Error.UNKNOWN_ERROR:
            return "An unknown error occurred. Please try again later";
        case APIResCode.Error.DB_CONNECTION_FAILED:
            return "Unable to connect to the database";
        case APIResCode.Error.DB_ERROR:
            return "A database error occurred during the operation";

        // ============================================================
        // SIGN UP ERRORS
        // ============================================================

        // -- Email --
        case APIResCode.Error.SignUp.Form.Email.NOT_PRESENT:
            return "Email address is required";
        case APIResCode.Error.SignUp.Form.Email.NOT_A_STRING:
            return "Email address must be a valid text string";
        case APIResCode.Error.SignUp.Form.Email.INVALID_USERNAME:
            return "The username part of your email is invalid";
        case APIResCode.Error.SignUp.Form.Email.INVALID_DOMAIN_NAME:
            return "The domain name of your email is invalid";
        case APIResCode.Error.SignUp.Form.Email.INVALID_EMAIL_CHARACTERS:
            return "Email contains invalid characters";
        case APIResCode.Error.SignUp.Form.Email.TOO_SHORT:
            return "Email address is too short";
        case APIResCode.Error.SignUp.Form.Email.TOO_LONG:
            return "Email address is too long";
        case APIResCode.Error.SignUp.Form.Email.FAILED:
            return "Email validation failed";

        // -- Name --
        case APIResCode.Error.SignUp.Form.Name.NOT_PRESENT:
            return "Name is required";
        case APIResCode.Error.SignUp.Form.Name.NOT_A_STRING:
            return "Name must be a text string";
        case APIResCode.Error.SignUp.Form.Name.TOO_SHORT:
            return "Name is too short";
        case APIResCode.Error.SignUp.Form.Name.TOO_LONG:
            return "Name is too long";
        case APIResCode.Error.SignUp.Form.Name.FAILED:
            return "Name validation failed";

        // -- Password --
        case APIResCode.Error.SignUp.Form.Password.NOT_PRESENT:
            return "Password is required";
        case APIResCode.Error.SignUp.Form.Password.NOT_A_STRING:
            return "Password must be a text string";
        case APIResCode.Error.SignUp.Form.Password.TOO_SHORT:
            return "Password is too short. It must be at least 8 characters";
        case APIResCode.Error.SignUp.Form.Password.TOO_LONG:
            return "Password is too long";
        case APIResCode.Error.SignUp.Form.Password.MISSING_LOWERCASE:
            return "Password must contain at least one lowercase letter";
        case APIResCode.Error.SignUp.Form.Password.MISSING_UPPERCASE:
            return "Password must contain at least one uppercase letter";
        case APIResCode.Error.SignUp.Form.Password.MISSING_NUMBER:
            return "Password must contain at least one number";
        case APIResCode.Error.SignUp.Form.Password.MISSING_SPECIAL_CHARACTER:
            return "Password must contain at least one special character";
        case APIResCode.Error.SignUp.Form.Password.FAILED:
            return "Password validation failed";

        // -- Referral Code --
        case APIResCode.Error.SignUp.Form.ReferralCode.PRESENT:
            return "Referral code provided";
        case APIResCode.Error.SignUp.Form.ReferralCode.A_STRING:
            return "Referral code must be a string";
        case APIResCode.Error.SignUp.Form.ReferralCode.START_WITH_REF:
            return "Referral code format is invalid (must start with 'REF')";
        case APIResCode.Error.SignUp.Form.ReferralCode.INVALID_REFERRAL_CODE_LENGTH:
            return "Referral code length is invalid";
        case APIResCode.Error.SignUp.Form.ReferralCode.FAILED:
            return "Referral code validation failed";

        // -- Captcha & General Signup --
        case APIResCode.Error.SignUp.Captcha.CAPTCHA_NOT_PRESENT:
            return "Captcha token is missing";
        case APIResCode.Error.SignUp.Captcha.CAPTCHA_NOT_A_STRING:
            return "Captcha token format is invalid";
        case APIResCode.Error.SignUp.Captcha.CAPTCHA_FAILED:
            return "Captcha verification failed. Please try again";
        case APIResCode.Error.SignUp.EMAIL_ALREADY_EXISTS:
            return "This email address is already registered";
        case APIResCode.Error.SignUp.DATABASE_ERROR:
            return "An error occurred while creating your account";
        case APIResCode.Error.SignUp.REFERRAL_CODE_NOT_FOUND:
            return "The provided referral code does not exist";
        case APIResCode.Error.SignUp.MAX_SIGNUP_ATTEMPTS_EXCEEDED:
            return "You have exceeded the maximum number of sign-up attempts";
        case APIResCode.Error.SignUp.SIGNUP_DISABLED_BY_POLICY:
            return "Sign-up is currently disabled by system policy";

        // ============================================================
        // VERIFY EMAIL ERRORS
        // ============================================================
        case APIResCode.Error.VerifyEmail.VfToken.NOT_PRESENT:
            return "Verification token is missing";
        case APIResCode.Error.VerifyEmail.VfToken.NOT_A_STRING:
            return "Verification token must be a string";
        case APIResCode.Error.VerifyEmail.VfToken.INVALID_LENGTH:
            return "Verification token length is invalid";
        case APIResCode.Error.VerifyEmail.VfToken.NON_HEX_CHARACTER:
            return "Verification token contains invalid characters";
        case APIResCode.Error.VerifyEmail.VERIFICATION_TOKEN_EXPIRED:
            return "This verification link has expired";
        case APIResCode.Error.VerifyEmail.VERIFICATION_TOKEN_NOT_FOUND_IN_DB:
            return "Invalid verification token";
        case APIResCode.Error.VerifyEmail.USER_NOT_FOUND:
            return "User account not found during verification";

        // ============================================================
        // LOGIN ERRORS
        // ============================================================

        // -- Email --
        case APIResCode.Error.Login.Form.Email.NOT_PRESENT:
            return "Please enter your email address";
        case APIResCode.Error.Login.Form.Email.NOT_A_STRING:
            return "Email format is invalid";
        case APIResCode.Error.Login.Form.Email.USERNAME:
            return "Invalid username in email";
        case APIResCode.Error.Login.Form.Email.INVALID_DOMAIN_NAME:
            return "Invalid domain name in email";
        case APIResCode.Error.Login.Form.Email.INVALID_EMAIL_CHARACTERS:
            return "Email contains illegal characters";
        case APIResCode.Error.Login.Form.Email.TOO_SHORT:
            return "Email is too short";
        case APIResCode.Error.Login.Form.Email.TOO_LONG:
            return "Email is too long";
        case APIResCode.Error.Login.Form.Email.FAILED:
            return "Invalid email address";

        // -- Password --
        case APIResCode.Error.Login.Form.Password.NOT_PRESENT:
            return "Please enter your password";
        case APIResCode.Error.Login.Form.Password.NOT_A_STRING:
            return "Password format is invalid";
        case APIResCode.Error.Login.Form.Password.TOO_SHORT:
            return "Password is too short";
        case APIResCode.Error.Login.Form.Password.TOO_LONG:
            return "Password is too long";
        case APIResCode.Error.Login.Form.Password.MISSING_LOWERCASE:
        case APIResCode.Error.Login.Form.Password.MISSING_UPPERCASE:
        case APIResCode.Error.Login.Form.Password.MISSING_NUMBER:
        case APIResCode.Error.Login.Form.Password.MISSING_SPECIAL_CHARACTER:
            return "Password format is incorrect"; // Generic message for login security
        case APIResCode.Error.Login.Form.Password.FAILED:
            return "Invalid password format";

        // -- General Login --
        case APIResCode.Error.Login.INCORRECT_PASSWORD:
            return "Incorrect password";
        case APIResCode.Error.Login.EMAIL_NOT_FOUND:
            return "No account found with this email address";
        case APIResCode.Error.Login.EMAIL_NOT_VERIFIED:
            return "Please verify your email address before logging in";

        // ============================================================
        // SESSION ERRORS
        // ============================================================
        case APIResCode.Error.Session.JWT.INVALID:
            return "Invalid session token";
        case APIResCode.Error.Session.JWT.CLAIM_VALIDATION_FAILED:
            return "Session validation failed";
        case APIResCode.Error.Session.JWT.DECRYPTION_FAILED:
            return "Unable to decrypt session";
        case APIResCode.Error.Session.JWT.EXPIRED:
            return "Your session has expired. Please log in again";
        case APIResCode.Error.Session.JWT.NOT_PRESENT:
            return "No session found";
        case APIResCode.Error.Session.JWT.JOSE.JOSE_ALGO_NOT_ALLOWED:
            return "Security algorithm not allowed";
        case APIResCode.Error.Session.USER_NOT_FOUND:
            return "Session belongs to a user that no longer exists";

        // ============================================================
        // LOGOUT ERRORS
        // ============================================================
        case APIResCode.Error.Logout.JWT.INVALID:
            return "Invalid token during logout";
        case APIResCode.Error.Logout.JWT.CLAIM_VALIDATION_FAILED:
            return "Token validation failed during logout";
        case APIResCode.Error.Logout.JWT.DECRYPTION_FAILED:
            return "Token decryption failed during logout";
        case APIResCode.Error.Logout.JWT.EXPIRED:
            return "Session already expired";
        case APIResCode.Error.Logout.JWT.NOT_PRESENT:
            return "You are already logged out";
        case APIResCode.Error.Logout.JWT.JOSE.JOSE_ALGO_NOT_ALLOWED:
            return "Logout failed due to algorithm mismatch";
        case APIResCode.Error.Logout.USER_NOT_FOUND:
            return "User not found during logout";

        // ============================================================
        // ACCOUNT / ELEVENLABS ERRORS
        // ============================================================

        // -- API Key Form --
        case APIResCode.Error.Account.ElevenLabs.Add.Form.APIKey.NOT_PRESENT:
            return "API Key not present";
        case APIResCode.Error.Account.ElevenLabs.Add.Form.APIKey.NOT_A_STRING:
            return "API Key must be a string";
        case APIResCode.Error.Account.ElevenLabs.Add.Form.APIKey.INVALID_PREFIX:
            return "API Key must start with 'sk_'";
        case APIResCode.Error.Account.ElevenLabs.Add.Form.APIKey.INVALID_LENGTH:
            return "API Key must be exactly 51 characters (sk_ + 48 hex characters)";
        case APIResCode.Error.Account.ElevenLabs.Add.Form.APIKey.INVALID_FORMAT:
            return "API Key must contain only lowercase hexadecimal characters (a-f, 0-9) after 'sk_'";

        // -- Email Form (Account Context) --
        case APIResCode.Error.Account.ElevenLabs.Add.Form.Email.NOT_PRESENT:
            return "Email not present";
        case APIResCode.Error.Account.ElevenLabs.Add.Form.Email.NOT_A_STRING:
            return "Email must be a string";
        case APIResCode.Error.Account.ElevenLabs.Add.Form.Email.INVALID_USERNAME:
            return "Email username must contain only letters and numbers (no dots, underscores, or special characters)";
        case APIResCode.Error.Account.ElevenLabs.Add.Form.Email.INVALID_DOMAIN_NAME:
            return "Email domain must contain only letters and numbers (no underscores or special characters)";
        case APIResCode.Error.Account.ElevenLabs.Add.Form.Email.INVALID_EMAIL_CHARACTERS:
            return "Email must not contain subdomains (format: username@domain.tld)";
        case APIResCode.Error.Account.ElevenLabs.Add.Form.Email.TOO_SHORT:
            return "Email is too short";
        case APIResCode.Error.Account.ElevenLabs.Add.Form.Email.TOO_LONG:
            return "Email is too long";
        case APIResCode.Error.Account.ElevenLabs.Add.Form.Email.FAILED_TO_VALIDATE_EMAIL:
            return "Invalid email address";

        // -- Password Form (Account Context) --
        case APIResCode.Error.Account.ElevenLabs.Add.Form.Password.NOT_PRESENT:
            return "Password not present";
        case APIResCode.Error.Account.ElevenLabs.Add.Form.Password.NOT_A_STRING:
            return "Password must be a string";
        case APIResCode.Error.Account.ElevenLabs.Add.Form.Password.TOO_SHORT:
            return "Password must be at least 8 characters long";
        case APIResCode.Error.Account.ElevenLabs.Add.Form.Password.TOO_LONG:
            return "Password must not exceed 128 characters";
        case APIResCode.Error.Account.ElevenLabs.Add.Form.Password.MISSING_LOWERCASE:
            return "Password must contain at least one lowercase letter";
        case APIResCode.Error.Account.ElevenLabs.Add.Form.Password.MISSING_UPPERCASE:
            return "Password must contain at least one uppercase letter";
        case APIResCode.Error.Account.ElevenLabs.Add.Form.Password.MISSING_NUMBER:
            return "Password must contain at least one number";
        case APIResCode.Error.Account.ElevenLabs.Add.Form.Password.MISSING_SPECIAL_CHARACTER:
            return "Password must contain at least one special character";
        case APIResCode.Error.Account.ElevenLabs.Add.Form.Password.FAILED_TO_VALIDATE_PASSWORD:
            return "Password validation failed";

        // -- ElevenLabs General --
        case APIResCode.Error.Account.ElevenLabs.Add.ElevenLabsAPI.UNPROCESSABLE_ENTITY:
            return "ElevenLabs API rejected the request (Unprocessable Entity)";
        case APIResCode.Error.Account.ElevenLabs.Add.ElevenLabsAPI.INVALID_API_KEY:
            return "The provided ElevenLabs API Key is invalid";
        case APIResCode.Error.Account.ElevenLabs.Add.ElevenLabsAPI.UNKNOWN:
            return "Unknown error from ElevenLabs API";
        case APIResCode.Error.Account.ElevenLabs.Add.ACCOUNT_ID_ALREADY_EXISTS:
            return "An account with this ID already exists";

        // -- Delete --
        case APIResCode.Error.Account.ElevenLabs.Delete.Params.ID.NOT_PRESENT:
            return "Account ID is missing for deletion";
        case APIResCode.Error.Account.ElevenLabs.Delete.Params.ID.TOO_SHORT:
            return "Account ID is too short";
        case APIResCode.Error.Account.ElevenLabs.Delete.Params.ID.TOO_LONG:
            return "Account ID is too long";
        case APIResCode.Error.Account.ElevenLabs.Delete.Params.ID.INVALID_CHARACTER_FOUND:
            return "Account ID contains invalid characters";
        case APIResCode.Error.Account.ElevenLabs.Delete.ACCOUNT_ID_NOT_FOUND:
            return "Account ID not found";

        // --- FALLBACK ---
        default:
            return `Unknown error occurred (Code: ${code})`;
    }
}
