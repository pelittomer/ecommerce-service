import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Company } from "./schemas/company.schema";
import { Model } from "mongoose";

@Injectable()
export class CompanyRepository {
    constructor(
        @InjectModel(Company.name) private companyModel: Model<Company>
    ) { }
    
}