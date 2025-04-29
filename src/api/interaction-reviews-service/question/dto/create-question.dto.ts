import { IsMongoId, IsNotEmpty, IsString } from "class-validator";
import { Types } from "mongoose";

export class CreateQuestionDto {
    @IsNotEmpty()
    @IsString()
    question: string;

    @IsNotEmpty()
    @IsMongoId()
    product: Types.ObjectId
}
