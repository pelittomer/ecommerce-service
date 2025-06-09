import { Types } from "mongoose";

export interface CheckIfProductPurchasedParams {
    userId: Types.ObjectId;
    productId: Types.ObjectId;
}
export interface IReviewUtilsService {
    validateProductExistence(productId: Types.ObjectId): Promise<void>;
    checkIfProductPurchased(params: CheckIfProductPurchasedParams): Promise<boolean>;
}