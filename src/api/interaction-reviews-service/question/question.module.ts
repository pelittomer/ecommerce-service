import { Module } from '@nestjs/common';
import { QuestionService } from './service/question.service';
import { QuestionController } from './question.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Question, QuestionSchema } from './entities/question.entity';
import { QuestionRepository } from './repository/question.repository';
import { ProductModule } from 'src/api/product-service/product/product.module';
import { SharedUtilsModule } from 'src/common/utils/shared-utils.module';
import { CompanyModule } from 'src/api/company-service/company/company.module';
import { QuestionUtilsService } from './utils/question-utils.service';

@Module({
  controllers: [QuestionController],
  providers: [QuestionService, QuestionRepository, QuestionUtilsService],
  imports: [
    MongooseModule.forFeature([{ name: Question.name, schema: QuestionSchema }]),
    ProductModule, SharedUtilsModule, CompanyModule
  ]
})
export class QuestionModule { }
