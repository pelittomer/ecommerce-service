import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Types } from "mongoose";
import { Product } from "src/api/product-service/product/entities/product.entity";
import { User } from "src/api/user-service/user/entities/user.entity";

@Schema({ timestamps: true })
export class Favorite {
    @Prop({ type: Types.ObjectId, ref: Product.name, required: true })
    product: Types.ObjectId;

    @Prop({ type: Types.ObjectId, ref: User.name, required: true })
    user: Types.ObjectId;
}

export const FavoriteSchema = SchemaFactory.createForClass(Favorite);