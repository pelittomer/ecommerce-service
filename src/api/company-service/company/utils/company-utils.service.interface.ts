import { Types } from "mongoose";
import { CompanyDocument } from "../entities/types";
import { Company } from "../entities/company.entity";

export interface ValidateCompanyUniquenessParams {
    userId: Types.ObjectId;
    companyName: string;
    taxId: string;
}
export interface ICompanyUtilsService {
    validateImageUpload(uploadedImage: Express.Multer.File): void;
    validateCompanyUniqueness(params: ValidateCompanyUniquenessParams): Promise<void>;
    getAndValidateUserCompany(userId: Types.ObjectId): Promise<CompanyDocument>;
    getCompanyById(companyId: Types.ObjectId): Promise<Company>;
}