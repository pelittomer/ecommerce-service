import { ProductDocument, ProductStockDocument } from "src/api/product-service/product/entities/types";
import { Cart } from "../entities/cart.entity";
import { CartDocument } from "../entities/types";
import { ClientSession, Types } from "mongoose";

export type PopulatedProduct = Pick<ProductDocument, '_id' | 'price' | 'discount'>
export type PopulatedProductStock = Pick<ProductStockDocument, '_id' | 'additional_price' | 'is_limited' | 'auto_replenish' | 'replenish_quantity' | 'stock_quantity'>
export type PopulateCart = Omit<Cart, 'product' | 'product_stock'> & {
    product: PopulatedProduct;
    product_stock: PopulatedProductStock;
}
export type TCartFindExists = Pick<CartDocument, '_id'> | null;
export type TCartFindByIdAndDelete = Pick<CartDocument, '_id' | 'product' | 'user'>;
export interface DeleteManyOptions {
    queryFields: Partial<Cart>;
    productIds: Types.ObjectId[];
}
export interface FindByIdAndUpdateOptions {
    cartId: Types.ObjectId;
    queryFields: Partial<Cart>;
}
export interface UpdateBulkWriteOptions {
    queryFields: any;
    session: ClientSession;
}
export interface DeletePurchasableProductsOptions {
    queryFieds: Pick<Cart, 'user' | 'is_purchasable'>;
    session: ClientSession;
}
export interface ICartRepository {
    findExists(queryFields: Partial<Cart>): Promise<TCartFindExists>;
    create(payload: Cart): Promise<void>;
    findById(cartId: Types.ObjectId): Promise<Cart | null>;
    findByIdAndDelete(cart: TCartFindByIdAndDelete): Promise<void>;
    find(queryFields: Partial<Cart>): Promise<Cart[]>;
    deleteMany(params: DeleteManyOptions): Promise<void>;
    findByIdAndUpdate(params: FindByIdAndUpdateOptions): Promise<void>;
    findIsPurschable(queryFields: Partial<Cart>): Promise<PopulateCart[]>;
    updateBulkWrite(params: UpdateBulkWriteOptions);
    deletePurchasableProducts(params:DeletePurchasableProductsOptions): Promise<void>;
}