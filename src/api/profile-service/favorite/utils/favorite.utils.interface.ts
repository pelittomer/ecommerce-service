import { Types } from "mongoose";
import { FavoriteDocument } from "../entities/types";

export interface validateProductAndFavoriteExistenceParams {
    product: Types.ObjectId;
    user: Types.ObjectId;
}
export interface ValidateFavoriteOwnershipParams {
    favoriteId: Types.ObjectId;
    user: Types.ObjectId;
}

export interface IFavoriteUtils {
    validateProductAndFavoriteExistence(params: validateProductAndFavoriteExistenceParams): Promise<void>;
    validateFavoriteOwnership(params: ValidateFavoriteOwnershipParams): Promise<FavoriteDocument>;
}