import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Question } from "./schemas/question.schema";
import { Model } from "mongoose";

@Injectable()
export class QuestionRepository {
    constructor(
        @InjectModel(Question.name) private questionModel: Model<Question>
    ) { }
    
}