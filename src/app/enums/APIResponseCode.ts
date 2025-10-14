export const APIResponseCode = {
    SUCCESS: 0,
    GENERIC_ERROR: 1,
    WORK_IN_PROGRESS: 2,

    LoginError: {},

    SignUpError: {},

    VerifyEmailError: {},

    CheckEmailError: {},

    SessionError: { INVALID_JWT: 100, JWT_EXPIRED: 101, NO_JWT: 103, USER_NOT_FOUND: 104 },
} as const;

/*
type EnumObj = Record<string, number>;
type NestedEnumObj = Record<string, NestedEnumObj>;

type ValueOf<T extends object> = T[keyof T];
type NestedValueOf<T

function stringify(code: ) {
    switch() {

    }
}

*/
