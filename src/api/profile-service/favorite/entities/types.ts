import { Document } from "mongoose";
import { Favorite } from "./favorite.entity";

export type FavoriteDocument = Favorite & Document;
