import { Injectable } from '@nestjs/common';
import { QuestionRepository } from '../repository/question.repository';
import { SharedUtilsService } from 'src/common/utils/shared-utils.service';
import { Types } from 'mongoose';
import { GetQuestionDto } from '../dto/get-question.dto';
import { Question } from '../entities/question.entity';
import { CreateAnswerParams, CreateQuestionParams, IQuestionService } from './question.service.interface';
import { QuestionUtilsService } from '../utils/question-utils.service';
import { QUESTION_MESSAGE } from '../constants/question.message';

@Injectable()
export class QuestionService implements IQuestionService {
    constructor(
        private readonly questionRepository: QuestionRepository,
        private readonly sharedUtilsService: SharedUtilsService,
        private readonly questionUtilsService: QuestionUtilsService,
    ) { }

    async createQuestion(params: CreateQuestionParams): Promise<string> {
        const { payload, req } = params
        const { product, question } = payload
        const userId = this.sharedUtilsService.getUserIdFromRequest(req)

        const productItem = await this.questionUtilsService.getAndValidateProduct(product)

        await this.questionRepository.createQuestion({
            question,
            product: new Types.ObjectId(product),
            customer: userId,
            company: productItem.company
        })

        return QUESTION_MESSAGE.QUESTION_CREATED_SUCCESS
    }

    async createAnswer(params: CreateAnswerParams): Promise<string> {
        const { payload, questionId, req } = params
        const userId = this.sharedUtilsService.getUserIdFromRequest(req)

        const company = await this.questionUtilsService.getAndValidateCompany(userId)
        await this.questionUtilsService.getAndValidateQuestionOwnership({ questionId, companyId: company._id as Types.ObjectId })
        await this.questionRepository.findByIdAndUpdate({
            questionId: questionId,
            payload: {
                ...payload,
                isAnswered: true,
            }
        })

        return QUESTION_MESSAGE.ANSWER_CREATED_SUCCESS
    }

    async findQuestions(query: GetQuestionDto): Promise<Question[]> {
        return this.questionRepository.find(query)
    }
}
