import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { UserDetails } from "./schemas/user-detail.schema";
import { Model } from "mongoose";

@Injectable()
export class UserDetailsRepository {
    constructor(
        @InjectModel(UserDetails.name) private uploadModel: Model<UserDetails>
    ) { }
    
}