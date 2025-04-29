import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateQuestionDto } from './dto/create-question.dto';
import { Request } from 'express';
import { QuestionRepository } from './question.repository';
import { SharedUtilsService } from 'src/common/utils/shared-utils.service';
import { Types } from 'mongoose';
import { ProductRepository } from 'src/api/product-service/product/product.repository';
import { UpdateQuestionDto } from './dto/update-question.dto';
import { CompanyRepository } from 'src/api/company-service/company/company.repository';
import { GetQuestionDto } from './dto/get-question.dto';
import { Question } from './schemas/question.schema';

@Injectable()
export class QuestionService {
    constructor(
        private readonly questionRepository: QuestionRepository,
        private readonly productRepository: ProductRepository,
        private readonly companyRepository: CompanyRepository,
        private readonly sharedUtilsService: SharedUtilsService,
    ) { }

    async createQuestion(userInputs: CreateQuestionDto, req: Request): Promise<string> {
        const { product, question } = userInputs

        const user = this.sharedUtilsService.getUserInfo(req)
        const userId = new Types.ObjectId(user.userId)

        const productExits = await this.productRepository.findById(product)
        if (!productExits) {
            throw new NotFoundException('Product not found.')
        }

        await this.questionRepository.createQuestion({
            question,
            product: new Types.ObjectId(product),
            customer: userId,
            company: productExits.company
        })

        return 'Your question has been successfully sent to the seller.'
    }

    async createAnswer(questionId: Types.ObjectId, userInputs: UpdateQuestionDto, req: Request): Promise<string> {
        const user = this.sharedUtilsService.getUserInfo(req)
        const userId = new Types.ObjectId(user.userId)

        const [companyExists, questionExists] = await Promise.all([
            this.companyRepository.findOne({ user: userId }),
            this.questionRepository.findById(questionId)
        ])

        if (
            !companyExists ||
            !questionExists ||
            !questionExists.company._id.equals(companyExists._id as Types.ObjectId)
        ) {
            throw new NotFoundException('Question not found!')
        }

        await this.questionRepository.findByIdAndUpdate(questionId, {
            ...userInputs,
            isAnswered: true
        })

        return 'Your answer has been successfully created.'
    }

    async findQuestions(query: GetQuestionDto): Promise<Question[]> {
        return this.questionRepository.find(query)
    }
}
