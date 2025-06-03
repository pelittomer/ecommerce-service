import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { User } from "../entities/user.entity";
import { Model } from "mongoose";
import { ProfileRepository } from "src/api/profile-service/profile/repository/profile.repository";
import { Role } from "src/common/types";
import { SharedUtilsService } from "src/common/utils/shared-utils.service";
import { CreateUserOptions, FindOneUserOptions, FindUserByIdOptions, FindUsersByOrQueryOptions, IUserRepository } from "./user.repository.interface";
import { UserDocument } from "../entities/types";
import { USER_MESSAGE } from "../constants/user-messages";

@Injectable()
export class UserRepository implements IUserRepository {
    constructor(
        @InjectModel(User.name) private userModel: Model<User>,
        private readonly profileRepository: ProfileRepository,
        private readonly sharedUtilsService: SharedUtilsService,
    ) { }

    async findByOrQuery(queryFields: FindUsersByOrQueryOptions): Promise<UserDocument | null> {
        const orConditions = Object.keys(queryFields).map(key => ({
            [key]: queryFields[key]
        }))
        return await this.userModel.findOne({ $or: orConditions })
    }

    async create(payload: CreateUserOptions): Promise<UserDocument> {
        const { roles } = payload
        let createdUser: UserDocument | null = null
        await this.sharedUtilsService.executeTransaction(async (session) => {
            const [user] = await this.userModel.create(
                [{ ...payload }],
                { session }
            )
            if (roles === Role.Customer) {
                await this.profileRepository.create({ user: user._id, session })
            }
            createdUser = user
        })
        if (!createdUser) {
            throw new Error(USER_MESSAGE.FAILED_TO_CREATE_USER)
        }
        return createdUser as UserDocument
    }

    async findOne(queryFields: FindOneUserOptions): Promise<UserDocument | null> {
        return await this.userModel.findOne(queryFields)
    }

    async findById(queryFields: FindUserByIdOptions): Promise<UserDocument | null> {
        return await this.userModel.findById(queryFields.userId)
    }
}