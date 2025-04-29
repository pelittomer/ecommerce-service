import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateQuestionDto } from './dto/create-question.dto';
import { Request } from 'express';
import { QuestionRepository } from './question.repository';
import { SharedUtilsService } from 'src/common/utils/shared-utils.service';
import { Types } from 'mongoose';
import { ProductRepository } from 'src/api/product-service/product/product.repository';

@Injectable()
export class QuestionService {
    constructor(
        private readonly questionRepository: QuestionRepository,
        private readonly productRepository: ProductRepository,
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
}
