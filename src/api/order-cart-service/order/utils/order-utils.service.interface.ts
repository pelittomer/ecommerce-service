import { Types } from "mongoose";
import { AddressDocument } from "src/api/profile-service/address/entities/types";
import { PopulateCart } from "../../cart/repository/cart.repository.interface";

export interface IOrderUtilsService {
    calculateTotalAmount(carts: PopulateCart[]): number;
    calculateItemPrice(item: PopulateCart): number;
    getAndValidatePurchasableCarts(userId: Types.ObjectId): Promise<PopulateCart[]>;
    getAndValidateDefaultAddress(userId: Types.ObjectId): Promise<Pick<AddressDocument, '_id'>> 
}