import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Question } from "../entities/question.entity";
import { Model, Types } from "mongoose";
import { GetQuestionDto } from "../dto/get-question.dto";
import { QuestionDocument } from "../entities/types";
import { IQuestionRepository, QuestionFindByIdAndUpdateOptions } from "./question.repository.interface";

@Injectable()
export class QuestionRepository implements IQuestionRepository {
    constructor(
        @InjectModel(Question.name) private questionModel: Model<Question>
    ) { }

    async createQuestion(userInputs: Partial<Question>): Promise<void> {
        await this.questionModel.create(userInputs)
    }

    async findById(questionId: Types.ObjectId): Promise<QuestionDocument | null> {
        return await this.questionModel.findById(questionId)
    }

    async findByIdAndUpdate(params: QuestionFindByIdAndUpdateOptions): Promise<void> {
        const { questionId, payload } = params
        await this.questionModel.findByIdAndUpdate(questionId, payload)
    }
    async find(query: GetQuestionDto): Promise<Question[]> {
        return this.questionModel.find({ product: new Types.ObjectId(query.productId) })
    }
}