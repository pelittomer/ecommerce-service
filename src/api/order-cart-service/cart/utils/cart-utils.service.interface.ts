import { Types } from "mongoose";
import { ProductStock } from "src/api/product-service/product/entities/product-stock.entity";
import { Cart } from "../entities/cart.entity";

export interface ValidateProductNotInCartParams {
    userId: Types.ObjectId;
    productId: Types.ObjectId;
}
export interface ValidateProductStockParams {
    productStockId: Types.ObjectId;
    requestedQuantity: number;
}
export interface GetAndValidateCartItemParams {
    cartId: Types.ObjectId;
    userId: Types.ObjectId;
}
export interface GetAndValidateCartItemOwnershipParams {
    cartId: Types.ObjectId;
    userId: Types.ObjectId;
}
export interface ICartUtilsService {
    validateProductExistence(productId: Types.ObjectId): Promise<void>;
    validateProductNotInCart(params: ValidateProductNotInCartParams): Promise<void>;
    validateProductStock(params: ValidateProductStockParams): Promise<ProductStock>;
    getAndValidateCartItem(params: GetAndValidateCartItemParams): Promise<Cart>;
    getAndValidateCartItemOwnership(params: GetAndValidateCartItemOwnershipParams): Promise<Cart>;
}