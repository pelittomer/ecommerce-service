import { Request } from "express";
import { CreateReturnRequestDto } from "../dto/create-return-request.dto"

export interface CreateReturnRequestParams {
    payload: CreateReturnRequestDto;
    req: Request;
}
export interface IReturnRequestService {
    createReturnRequest(params: CreateReturnRequestParams): Promise<string>
}