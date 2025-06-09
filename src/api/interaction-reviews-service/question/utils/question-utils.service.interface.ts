import { Types } from "mongoose";
import { CompanyDocument } from "src/api/company-service/company/schemas/company.schema";
import { ProductDocument } from "src/api/product-service/product/entities/types";
import { QuestionDocument } from "../entities/types";

export interface GetAndValidateQuestionOwnershipParams {
    questionId: Types.ObjectId;
    companyId: Types.ObjectId;
}
export interface IQuestionUtilsService {
    getAndValidateProduct(productId: Types.ObjectId): Promise<ProductDocument>;
    getAndValidateCompany(userId: Types.ObjectId): Promise<CompanyDocument>;
    getAndValidateQuestionOwnership(params: GetAndValidateQuestionOwnershipParams): Promise<QuestionDocument>;
}