import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Question } from "./schemas/question.schema";
import { Model } from "mongoose";

@Injectable()
export class QuestionRepository {
    constructor(
        @InjectModel(Question.name) private questionModel: Model<Question>
    ) { }

    async createQuestion(userInputs: Partial<Question>): Promise<void> {
        await this.questionModel.create(userInputs)
    }
}