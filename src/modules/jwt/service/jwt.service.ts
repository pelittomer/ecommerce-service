import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { JwtService as NestJwtService } from "@nestjs/jwt"
import { Types } from "mongoose";
import { AppConfig } from "src/config/type";
import { IJwtService, JwtPayload } from "./jwt.service.interface";
import { UserDocument } from "src/api/user-service/user/entities/types";

@Injectable()
export class JwtService implements IJwtService {
    private readonly accessTokenExpiresIn = '15m'
    private readonly refreshTokenExpiresIn = '7d'
    private readonly secretKey: string

    constructor(
        private readonly nestJwtService: NestJwtService,
        private readonly configService: ConfigService<AppConfig>
    ) {
        this.secretKey = this.configService.get('auth.secret_key', {
            infer: true,
        })! // We are using the ! operator to assert that this value is definitely defined.
    }

    private async signToken(payload: JwtPayload, expiresIn: string): Promise<string> {
        return await this.nestJwtService.signAsync(payload, {
            expiresIn,
            secret: this.secretKey
        })
    }

    createJwtPayload(user: UserDocument): JwtPayload {
        return {
            userId: user._id as Types.ObjectId,
            username: user.username,
            roles: user.roles,
        }
    }

    async signAccessToken(payload: JwtPayload): Promise<string> {
        return await this.signToken(payload, this.accessTokenExpiresIn)
    }

    async signRefreshToken(payload: JwtPayload): Promise<string> {
        return await this.signToken(payload, this.refreshTokenExpiresIn)
    }

    async decodedToken(refreshToken: string): Promise<JwtPayload> {
        return await this.nestJwtService.verifyAsync(refreshToken, { secret: this.secretKey })
    }
}

