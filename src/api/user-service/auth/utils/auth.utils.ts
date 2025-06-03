import { BadRequestException, Injectable, NotFoundException, UnauthorizedException } from "@nestjs/common";
import { IAuthUtils, ValidateNewUserParams, ValidateUserForLoginParams } from "./auth.utils.interface";
import { UserRole } from "../types";
import { NonAdminRole } from "../service/auth.service.interface";
import { Role, UserDocument } from "../../user/entities/types";
import { UserRepository } from "../../user/repository/user.repository";
import { BcryptService } from "src/modules/bcrypt/service/bcrypt.service";
import { AUTH_MESSAGES } from "../constants/auth-messages";
import { Request } from "express";
import { Types } from "mongoose";

@Injectable()
export class AuthUtils implements IAuthUtils {
    constructor(
        private readonly userRepository: UserRepository,
        private readonly bcryptService: BcryptService,
    ) { }

    mapRoleParamToEnum(roleParam: UserRole): NonAdminRole {
        return roleParam === 'customer' ? Role.Customer : Role.Seller
    }

    async validateNewUser(params: ValidateNewUserParams): Promise<void> {
        const userExists = await this.userRepository.findByOrQuery(params)
        if (userExists) {
            if (userExists.username === params.username) {
                throw new BadRequestException(AUTH_MESSAGES.USERNAME_ALREADY_IN_USE)
            } else if (userExists.email === params.email) {
                throw new BadRequestException(AUTH_MESSAGES.EMAIL_ALREADY_REGISTERED)
            }
        }
    }

    async validateUserForLogin(params: ValidateUserForLoginParams): Promise<UserDocument> {
        const { email, password, roles } = params
        const foundUser = await this.userRepository.findOne({ email })
        if (!foundUser) {
            throw new NotFoundException(AUTH_MESSAGES.LOGIN_NOT_FOUND)
        }
        if (foundUser.roles !== roles && foundUser.roles !== Role.Admin) {
            throw new BadRequestException(AUTH_MESSAGES.LOGIN_UNAUTHORIZED_ROLE)
        }
        await this.bcryptService.verifyPassword(password, foundUser.password)
        return foundUser
    }

    extractRefreshTokenFromCookie(req: Request): string {
        const cookies = req.cookies
        if (!cookies.jwt) {
            throw new UnauthorizedException(AUTH_MESSAGES.REFRESH_TOKEN_MISSING)
        }
        return cookies.jwt
    }

    async validateUserForRefresh(userId: Types.ObjectId): Promise<UserDocument> {
        const foundUser = await this.userRepository.findById({ userId })
        if (!foundUser) {
            throw new UnauthorizedException(AUTH_MESSAGES.REFRESH_USER_NOT_FOUND)
        }
        return foundUser
    }
}