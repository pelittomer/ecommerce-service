import { ForbiddenException, Injectable, NotFoundException } from "@nestjs/common";
import { GetAndValidateQuestionOwnershipParams, IQuestionUtilsService } from "./question-utils.service.interface";
import { QUESTION_MESSAGE } from "../constants/question.message";
import { ProductRepository } from "src/api/product-service/product/repository/product.repository";
import { Types } from "mongoose";
import { ProductDocument } from "src/api/product-service/product/entities/types";
import { CompanyRepository } from "src/api/company-service/company/repository/company.repository";
import { QuestionDocument } from "../entities/types";
import { QuestionRepository } from "../repository/question.repository";
import { CompanyDocument } from "src/api/company-service/company/entities/types";

@Injectable()
export class QuestionUtilsService implements IQuestionUtilsService {
    constructor(
        private readonly productRepository: ProductRepository,
        private readonly companyRepository: CompanyRepository,
        private readonly questionRepository: QuestionRepository,
    ) { }

    async getAndValidateProduct(productId: Types.ObjectId): Promise<ProductDocument> {
        const product = await this.productRepository.findById(productId)
        if (!product) {
            throw new NotFoundException(QUESTION_MESSAGE.PRODUCT_NOT_FOUND)
        }
        return product
    }

    async getAndValidateCompany(userId: Types.ObjectId): Promise<CompanyDocument> {
        const company = await this.companyRepository.findOne({ user: userId })
        if (!company) {
            throw new NotFoundException(QUESTION_MESSAGE.COMPANY_NOT_FOUND)
        }
        return company
    }

    async getAndValidateQuestionOwnership(params: GetAndValidateQuestionOwnershipParams): Promise<QuestionDocument> {
        const { companyId, questionId } = params
        const question = await this.questionRepository.findById(questionId)

        if (!question) {
            throw new NotFoundException(QUESTION_MESSAGE.QUESTION_NOT_FOUND)
        }

        if (!question.company._id.equals(companyId)) {
            throw new ForbiddenException(QUESTION_MESSAGE.UNAUTHORIZED_ACTION)
        }
        return question
    }
}