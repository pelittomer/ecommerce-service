import { ReturnRequest } from "../entities/return-request.entity";

export interface IReturnRequestRepository {
    create(payload: Partial<ReturnRequest>): Promise<void>;
}