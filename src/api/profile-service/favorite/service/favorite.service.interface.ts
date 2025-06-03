import { Request } from "express";
import { CreateFavoriteDto } from "../dto/create-favorite.dto";
import { Favorite } from "../entities/favorite.entity";
import { Types } from "mongoose";

export interface CreateFavoriteServiceParams {
    payload: CreateFavoriteDto;
    req: Request;
}
export interface RemoveFavoriteServiceParams {
    favoriteId: Types.ObjectId;
    req: Request;
}
export interface IFavoriteService {
    createFavorite(params: CreateFavoriteServiceParams): Promise<string>;
    removeFavorite(params: RemoveFavoriteServiceParams): Promise<string>;
    findFavorites(req: Request): Promise<Favorite[]>;
    removeAllFavorites(req: Request): Promise<string>;
}