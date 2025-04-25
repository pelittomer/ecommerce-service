import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { UserDetails } from "./schemas/user-detail.schema";
import { ClientSession, Model } from "mongoose";

@Injectable()
export class UserDetailsRepository {
    constructor(
        @InjectModel(UserDetails.name) private userDetailsModel: Model<UserDetails>
    ) { }

    async create(userInputs: Pick<UserDetails, "user">, session?: ClientSession): Promise<void> {
        await this.userDetailsModel.create([userInputs], { session })
    }
}