import { Document } from "mongoose";
import { Cart } from "./cart.entity";

export type CartDocument = Cart & Document;
