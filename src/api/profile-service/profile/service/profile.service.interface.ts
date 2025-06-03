import { Request } from "express";
import { ProfileDocument } from "../entities/types";
import { PartialUpdateProfileDto } from "../dto/update-profile.dto";

export interface UpdateProfileServiceParams {
    payload: Partial<PartialUpdateProfileDto>;
    req: Request;
    uploadedImage: Express.Multer.File;
}

export interface IProfileService {
    updateProfile(params: UpdateProfileServiceParams): Promise<string>;
    findProfile(req: Request): Promise<ProfileDocument | null>;
}