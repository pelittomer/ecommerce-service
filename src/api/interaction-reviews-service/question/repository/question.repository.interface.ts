import { Types } from "mongoose";
import { Question } from "../entities/question.entity";
import { QuestionDocument } from "../entities/types";
import { GetQuestionDto } from "../dto/get-question.dto";

export interface QuestionFindByIdAndUpdateOptions {
    questionId: Types.ObjectId;
    payload: Partial<Question>;
}
export interface IQuestionRepository {
    createQuestion(userInputs: Partial<Question>): Promise<void>;
    findById(questionId: Types.ObjectId): Promise<QuestionDocument | null>;
    findByIdAndUpdate(params: QuestionFindByIdAndUpdateOptions): Promise<void>;
    find(query: GetQuestionDto): Promise<Question[]>;
}