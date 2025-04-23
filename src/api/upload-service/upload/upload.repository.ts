import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Upload } from "./schemas/upload.schema";
import { Model } from "mongoose";

@Injectable()
export class UploadRepository {
    constructor(
        @InjectModel(Upload.name) private uploadModel: Model<Upload>
    ) { }

}