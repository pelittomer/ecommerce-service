import { Types } from "mongoose";
import { Favorite } from "../entities/favorite.entity";
import { FavoriteDocument } from "../entities/types";

export interface FavoriteDeleteManyOptions {
    payload: Partial<Favorite>;
    productIds: Types.ObjectId[];
}

export interface IFavoriteRepository {
    findExists(queryFields: Partial<Favorite>): Promise<Pick<FavoriteDocument, '_id'> | null>;
    create(payload: Favorite): Promise<void>;
    findById(favoriteId: Types.ObjectId): Promise<FavoriteDocument | null>;
    findByIdAndDelete(favorite: FavoriteDocument): Promise<void>;
    find(queryFields: Partial<Favorite>): Promise<Favorite[]>;
    findExistFavorites(queryFields: Partial<Favorite>): Promise<Pick<FavoriteDocument, '_id' | 'product'>[]>;
    deleteMany(params: FavoriteDeleteManyOptions): Promise<void>;
}