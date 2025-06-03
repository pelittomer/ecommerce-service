import { Types } from "mongoose";
import { Role, UserDocument } from "../../user/entities/types";
import { NonAdminRole } from "../service/auth.service.interface";
import { UserRole } from "../types";
import { Request } from "express";

export interface ValidateUserForLoginParams {
    email: string;
    password: string;
    roles: Role;
}
export interface ValidateNewUserParams {
    email: string;
    username: string;
}
export interface IAuthUtils {
    mapRoleParamToEnum(roleParam: UserRole): NonAdminRole;
    validateNewUser(params: ValidateNewUserParams): Promise<void>;
    validateUserForLogin(params: ValidateUserForLoginParams): Promise<UserDocument>;
    extractRefreshTokenFromCookie(req: Request): string;
    validateUserForRefresh(userId: Types.ObjectId): Promise<UserDocument>;
}