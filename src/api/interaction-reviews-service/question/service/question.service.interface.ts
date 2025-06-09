import { Request } from "express";
import { CreateQuestionDto } from "../dto/create-question.dto";
import { Types } from "mongoose";
import { UpdateQuestionDto } from "../dto/update-question.dto";
import { GetQuestionDto } from "../dto/get-question.dto";
import { Question } from "../entities/question.entity";

export interface CreateQuestionParams {
    payload: CreateQuestionDto;
    req: Request;
}
export interface CreateAnswerParams {
    questionId: Types.ObjectId;
    payload: UpdateQuestionDto;
    req: Request;
}
export interface IQuestionService {
    createQuestion(params: CreateQuestionParams): Promise<string>;
    createAnswer(params: CreateAnswerParams): Promise<string>;
    findQuestions(query: GetQuestionDto): Promise<Question[]>;
}