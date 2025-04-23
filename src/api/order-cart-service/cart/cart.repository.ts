import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Cart } from "./schemas/cart.schema";
import { Model } from "mongoose";

@Injectable()
export class CartRepository {
    constructor(
        @InjectModel(Cart.name) private cartModel: Model<Cart>
    ) { }

}