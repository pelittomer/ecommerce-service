import { Request } from "express";
import { UserDocument } from "../entities/types";

export interface IUserService {
    findUser(req: Request): Promise<UserDocument | null>;
}