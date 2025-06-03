import { Document } from "mongoose";
import { Address } from "./address.entity";

export type AddressDocument = Address & Document;
