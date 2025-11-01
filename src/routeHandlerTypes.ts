import { IAPIErrorResponse } from "./interfaces/apiResponses/iAPIResponse";
import { IAPISessionErrorResponse, IAPISessionSuccessResponse } from "./interfaces/apiResponses/session";

export type GetSessionRouteHandlerReturnType =
    | IAPISessionSuccessResponse
    | IAPISessionErrorResponse
    | IAPIErrorResponse;
