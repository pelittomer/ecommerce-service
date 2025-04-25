import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { User, UserDocument } from "./schemas/user.schema";
import { Model } from "mongoose";
import { UserDetailsRepository } from "src/api/profile-service/user-details/user-details.repository";
import { Role } from "src/common/types";
import { SharedUtilsService } from "src/common/utils/shared-utils.service";

@Injectable()
export class UserRepository {
    constructor(
        @InjectModel(User.name) private userModel: Model<User>,
        private readonly userDetailsRepository: UserDetailsRepository,
        private readonly sharedUtilsService: SharedUtilsService,
    ) { }

    async findByOrQuery(queryFields: Partial<Record<keyof User, any>>): Promise<UserDocument | null> {
        const orConditions = Object.keys(queryFields).map(key => ({
            [key]: queryFields[key]
        }))
        return await this.userModel.findOne({ $or: orConditions })
    }

    async create(userInputs: Partial<User>, role: Exclude<Role, Role.Admin>): Promise<UserDocument> {
        let createdUser: UserDocument | null = null
        await this.sharedUtilsService.executeTransaction(async (session) => {
            const [user] = await this.userModel.create(
                [{ ...userInputs, roles: role }],
                { session }
            )
            if (role === Role.Customer) {
                await this.userDetailsRepository.create({ user: user._id }, session)
            }
            createdUser = user
        })
        if (!createdUser) {
            throw new Error('Failed to create user.')
        }
        return createdUser as UserDocument
    }
}