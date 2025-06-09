import { Document } from "mongoose";
import { ReturnRequest } from "./return-request.entity";

export type ReturnRequestDocument = ReturnRequest & Document;
export enum ReturnRequestStatus {
    ReturnRequested = "return_requested",
    ReturnApproved = "return_approved",
    ReturnRejected = "return_rejected",
    Returned = "returned",
    CancellationRequested = "cancellation_requested",
}