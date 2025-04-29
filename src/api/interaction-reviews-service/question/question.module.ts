import { Module } from '@nestjs/common';
import { QuestionService } from './question.service';
import { QuestionController } from './question.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Question, QuestionSchema } from './schemas/question.schema';
import { QuestionRepository } from './question.repository';
import { ProductModule } from 'src/api/product-service/product/product.module';
import { SharedUtilsModule } from 'src/common/utils/shared-utils.module';

@Module({
  controllers: [QuestionController],
  providers: [QuestionService, QuestionRepository],
  imports: [
    MongooseModule.forFeature([{ name: Question.name, schema: QuestionSchema }]),
    ProductModule,SharedUtilsModule
  ]
})
export class QuestionModule { }
