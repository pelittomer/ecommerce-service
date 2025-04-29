import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Question, QuestionDocument } from "./schemas/question.schema";
import { Model, Types } from "mongoose";
import { GetQuestionDto } from "./dto/get-question.dto";

@Injectable()
export class QuestionRepository {
    constructor(
        @InjectModel(Question.name) private questionModel: Model<Question>
    ) { }

    async createQuestion(userInputs: Partial<Question>): Promise<void> {
        await this.questionModel.create(userInputs)
    }

    async findById(questionId: Types.ObjectId): Promise<QuestionDocument | null> {
        return await this.questionModel.findById(questionId)
    }

    async findByIdAndUpdate(questionId: Types.ObjectId, userInputs: Partial<Question>): Promise<void> {
        await this.questionModel.findByIdAndUpdate(questionId, userInputs)
    }
    async find(query: GetQuestionDto): Promise<Question[]> {
        return this.questionModel.find({ product: new Types.ObjectId(query.productId) })
    }
}