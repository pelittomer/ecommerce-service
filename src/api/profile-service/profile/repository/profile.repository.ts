import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { ClientSession, Model, Types } from "mongoose";
import { UploadService } from "src/api/upload-service/upload/upload.service";
import { SharedUtilsService } from "src/common/utils/shared-utils.service";
import { Profile } from "../entities/profile.entity";
import { ProfileDocument } from "../entities/types";
import { CreateProfileOptions, FindOneAndUpdateProfileOptions, IProfileRepository } from "./profile.repository.interface";
import { PROFILE_MESSAGE } from "../constants/profile.message";

@Injectable()
export class ProfileRepository implements IProfileRepository {
    constructor(
        @InjectModel(Profile.name) private userDetailsModel: Model<Profile>,
        private readonly sharedUtilsService: SharedUtilsService,
        private readonly uploadService: UploadService,
    ) { }

    async create(params: CreateProfileOptions): Promise<void> {
        const { user, session } = params
        await this.userDetailsModel.create([user], { session })
    }

    async findOne(queryFieds: Partial<Profile>): Promise<ProfileDocument | null> {
        return await this.userDetailsModel.findOne(queryFieds)
    }

    async findOneAndUpdate(params: FindOneAndUpdateProfileOptions): Promise<void> {
        const { user, payload, uploadedImage } = params
        const existingUserDetails = await this.findOne({ user })
        if (!existingUserDetails) {
            throw new NotFoundException(PROFILE_MESSAGE.PRFOILE_NOT_FOUND)
        }

        await this.sharedUtilsService.executeTransaction(async (session) => {
            if (uploadedImage) {
                const newImage = existingUserDetails.avatar
                    ? await this.uploadService.updateExistingImage(uploadedImage, existingUserDetails.avatar)
                    : await this.uploadService.createImage(uploadedImage, session)
                if (newImage) payload.avatar = newImage as Types.ObjectId
            }

            await this.userDetailsModel.findOneAndUpdate(user, payload, { session })
        })
    }
}