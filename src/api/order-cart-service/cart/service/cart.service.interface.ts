import { Request } from "express";
import { CreateCartDto } from "../dto/create-cart.dto";
import { Types } from "mongoose";
import { Cart } from "../entities/cart.entity";
import { UpdateCartDto } from "../dto/update-cart.dto";

export interface CreateCartParams {
    payload: CreateCartDto;
    req: Request;
}
export interface RemoveCartParams {
    cartId: Types.ObjectId;
    req: Request;
}
export interface UpdateCartParams {
    cartId: Types.ObjectId;
    payload: UpdateCartDto;
    req: Request;
}
export interface ICartService {
    createCart(params: CreateCartParams): Promise<string>;
    removeCart(params: RemoveCartParams): Promise<string>;
    findCarts(req: Request): Promise<Cart[]>;
    removeCarts(req: Request): Promise<string>;
    updateCart(params: UpdateCartParams): Promise<string>
}