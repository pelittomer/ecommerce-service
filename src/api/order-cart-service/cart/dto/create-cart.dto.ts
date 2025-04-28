import { IsMongoId, IsNotEmpty, IsNumber, IsPositive } from "class-validator";
import { Types } from "mongoose";

export class CreateCartDto {
    @IsNumber()
    @IsNotEmpty()
    @IsPositive()
    quantity: number;

    @IsMongoId()
    @IsNotEmpty()
    product: Types.ObjectId;

    @IsMongoId()
    @IsNotEmpty()
    product_stock: Types.ObjectId;
}
