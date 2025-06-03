import { RegisterDto } from "../dto/register.dto";
import { LoginDto } from "../dto/login.dto";
import { Role } from "../../user/entities/types";
import { Request, Response } from "express";

export type NonAdminRole = Exclude<Role, Role.Admin>
export type TAccessToken = { accessToken: string }
export interface RegisterServiceParams extends RegisterDto {
    roles: NonAdminRole;
}
export interface LoginServiceParams extends LoginDto {
    roles: Role;
    res: Response;
}
export interface LogoutServiceParams {
    req: Request;
    res: Response;
}
export interface RefreshServiceParams {
    req: Request;
}
export interface IAuthService {
    register(params: RegisterServiceParams): Promise<string>;
    login(params: LoginServiceParams): Promise<TAccessToken>;
    logout(params: LogoutServiceParams): string | undefined;
    refresh(params: RefreshServiceParams): Promise<TAccessToken>
}