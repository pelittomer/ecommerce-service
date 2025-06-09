import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { Types } from 'mongoose';
import { Company } from 'src/api/company-service/company/schemas/company.schema';
import { Product } from 'src/api/product-service/product/entities/product.entity';
import { User } from 'src/api/user-service/user/entities/user.entity';

@Schema({ timestamps: true })
export class Question {
    @Prop({ required: true })
    question: string;

    @Prop()
    answer: string;

    @Prop({ default: false })
    isAnswered: boolean;

    @Prop({ type: Types.ObjectId, ref: User.name, required: true })
    customer: Types.ObjectId;

    @Prop({ type: Types.ObjectId, ref: Company.name, required: true })
    company: Types.ObjectId;

    @Prop({ type: Types.ObjectId, ref: Product.name, required: true })
    product: Types.ObjectId;
}

export const QuestionSchema = SchemaFactory.createForClass(Question)