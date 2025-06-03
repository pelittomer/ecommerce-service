import { Types } from "mongoose";
import { UserDocument } from "../entities/types";
import { User } from "../entities/user.entity";

export interface FindUsersByOrQueryOptions extends Partial<Record<keyof User, any>> { }
export interface CreateUserOptions extends Partial<User> { }

export interface FindOneUserOptions extends Partial<User> { }

export interface FindUserByIdOptions {
    userId: Types.ObjectId;
}

export interface IUserRepository {
    findByOrQuery(queryFields: FindUsersByOrQueryOptions): Promise<UserDocument | null>;
    create(queryFields: CreateUserOptions): Promise<UserDocument>;
    findOne(queryFields: FindOneUserOptions): Promise<UserDocument | null>;
    findById(queryFields: FindUserByIdOptions): Promise<UserDocument | null>;
}