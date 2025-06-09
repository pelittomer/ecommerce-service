import { Document } from "mongoose";
import { Question } from "./question.entity";

export type QuestionDocument = Question & Document;
