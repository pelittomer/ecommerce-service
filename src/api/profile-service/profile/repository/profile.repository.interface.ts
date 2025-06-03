import { ClientSession, Types } from "mongoose";
import { ProfileDocument } from "../entities/types";
import { Profile } from "../entities/profile.entity";

export interface CreateProfileOptions {
    user: Types.ObjectId;
    session: ClientSession;
}
export interface FindOneProfileOptions extends Partial<Profile> { }
export interface FindOneAndUpdateProfileOptions {
    user: Types.ObjectId;
    payload: Partial<Profile>;
    uploadedImage: Express.Multer.File;
}
export interface IProfileRepository {
    create(params: CreateProfileOptions): Promise<void>;
    findOne(queryFields: FindOneProfileOptions): Promise<ProfileDocument | null>;
    findOneAndUpdate(params: FindOneAndUpdateProfileOptions): Promise<void>;
}