import { IAPIErrorResponse, IAPISuccessResponse } from "./iAPIResponse";
import { ValueOf, Flatten } from "@/lib/enum";
import { APIResponseCode } from "@/enums/APIResponseCode";
import { IUser } from "../IUser";

export interface IAPISignUpErrorResponse extends IAPIErrorResponse {
    code: ValueOf<Flatten<typeof APIResponseCode.Error.SignUp>>;
}

export interface IAPISignUpSuccessResponse extends IAPISuccessResponse {
    data: { user: IUser };
}

export interface IAPISignUpFormErrorResponse extends IAPISignUpErrorResponse {
    code: ValueOf<Flatten<typeof APIResponseCode.Error.SignUp.Form>>;
}

export interface IAPISignUpFormEmailErrorResponse extends IAPISignUpErrorResponse {
    code: ValueOf<Flatten<typeof APIResponseCode.Error.SignUp.Form.Email>>;
}

export interface IAPISignUpFormNameErrorResponse extends IAPISignUpErrorResponse {
    code: ValueOf<Flatten<typeof APIResponseCode.Error.SignUp.Form.Name>>;
}

export interface IAPISignUpFormPasswordErrorResponse extends IAPISignUpErrorResponse {
    code: ValueOf<Flatten<typeof APIResponseCode.Error.SignUp.Form.Password>>;
}

export interface IAPISignUpFormCaptchaErrorResponse extends IAPISignUpErrorResponse {
    code: ValueOf<Flatten<typeof APIResponseCode.Error.SignUp.Form.ReferralCode>>;
}
