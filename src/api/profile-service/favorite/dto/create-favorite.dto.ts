import { Transform } from "class-transformer";
import { IsMongoId, IsNotEmpty } from "class-validator";
import { Types } from "mongoose";

export class CreateFavoriteDto {
    @IsMongoId()
    @IsNotEmpty()
    @Transform(({ value }) => value.trim())
    productId: Types.ObjectId
}
