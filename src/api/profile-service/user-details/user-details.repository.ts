import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { UserDetails } from "./entities/user-detail.entity";
import { ClientSession, Model, Types } from "mongoose";
import { UploadService } from "src/api/upload-service/upload/upload.service";
import { SharedUtilsService } from "src/common/utils/shared-utils.service";
import { UserDetailsDocument } from "./entities/types";

@Injectable()
export class UserDetailsRepository {
    constructor(
        @InjectModel(UserDetails.name) private userDetailsModel: Model<UserDetails>,
        private readonly sharedUtilsService: SharedUtilsService,
        private readonly uploadService: UploadService,
    ) { }

    async create(userInputs: Pick<UserDetails, "user">, session?: ClientSession): Promise<void> {
        await this.userDetailsModel.create([userInputs], { session })
    }

    async findOne(queryFieds: Partial<UserDetails>): Promise<UserDetailsDocument | null> {
        return await this.userDetailsModel.findOne(queryFieds)
    }

    async findOneAndUpdate(
        queryFields: Partial<UserDetails>,
        userInputs: Partial<UserDetails>,
        uploadedImage?: Express.Multer.File
    ): Promise<void> {
        const existingUserDetails = await this.findOne({ user: queryFields.user })
        if (!existingUserDetails) {
            throw new NotFoundException('User details not found.')
        }

        await this.sharedUtilsService.executeTransaction(async (session) => {
            if (uploadedImage) {
                const newImage = existingUserDetails.avatar
                    ? await this.uploadService.updateExistingImage(uploadedImage, existingUserDetails.avatar)
                    : await this.uploadService.createImage(uploadedImage, session)
                if (newImage) userInputs.avatar = newImage as Types.ObjectId
            }

            await this.userDetailsModel.findOneAndUpdate(queryFields, userInputs, { session })
        })
    }
}