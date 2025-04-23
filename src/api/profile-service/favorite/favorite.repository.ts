import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Favorite } from "./schemas/favorite.schema";
import { Model } from "mongoose";

@Injectable()
export class FavoriteRepository {
    constructor(
        @InjectModel(Favorite.name) private uploadModel: Model<Favorite>
    ) { }
    
}
