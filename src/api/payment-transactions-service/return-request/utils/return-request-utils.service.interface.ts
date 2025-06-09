import { Types } from "mongoose";

export interface ValidateOrderItemParams {
    userId: Types.ObjectId;
    orderItemId: Types.ObjectId;
}
export interface IReturnRequestUtilsService {
    validateOrderItem(params: ValidateOrderItemParams): Promise<void>;
}