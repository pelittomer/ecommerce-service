import { BadRequestException, ForbiddenException, HttpStatus, Injectable, Logger, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { UserRepository } from '../../user/repository/user.repository';
import { CookieOptions} from 'express';
import { IAuthService, LoginServiceParams, LogoutServiceParams, RefreshServiceParams, RegisterServiceParams, TAccessToken } from './auth.service.interface';
import { AuthUtils } from '../utils/auth.utils';
import { BcryptService } from 'src/modules/bcrypt/service/bcrypt.service';
import { AUTH_MESSAGES } from '../constants/auth-messages';
import { JwtService } from 'src/modules/jwt/service/jwt.service';

@Injectable()
export class AuthService implements IAuthService {
    private readonly logger = new Logger(AuthService.name)
    private readonly clearJwtCookieOptions: CookieOptions = {
        httpOnly: true,
        secure: true,
        sameSite: 'none',
    }
    private readonly jwtCookieOptions: CookieOptions = {
        ...this.clearJwtCookieOptions,
        maxAge: 7 * 24 * 60 * 60 * 1000,
    }

    constructor(
        private readonly userRepository: UserRepository,
        private readonly authUtils: AuthUtils,
        private readonly jwtService: JwtService,
        private readonly bcryptService: BcryptService,
    ) { }

    async register(params: RegisterServiceParams): Promise<string> {
        const { username, email, password, roles } = params

        await this.authUtils.validateNewUser({ email, username })

        const hashedPassword = await this.bcryptService.hashPassword(password)
        const user = await this.userRepository.create({
            ...params,
            password: hashedPassword,
        })

        this.logger.log(`User registration completed successfully: username=${username}, userId=${user._id}, role=${roles}`)

        return AUTH_MESSAGES.REGISTER_SUCCESS
    }

    async login(params: LoginServiceParams): Promise<TAccessToken> {
        const { email, password, roles, res } = params

        try {
            const user = await this.authUtils.validateUserForLogin({ email, password, roles })

            const payload = this.jwtService.createJwtPayload(user)
            const accessToken = await this.jwtService.signAccessToken(payload)
            const refreshToken = await this.jwtService.signRefreshToken(payload)

            res.cookie('jwt', refreshToken, this.jwtCookieOptions)

            return { accessToken }
        } catch (error) {
            if (
                error instanceof BadRequestException ||
                error instanceof NotFoundException ||
                error instanceof UnauthorizedException
            ) {
                this.logger.warn(error.message, error.stack)
                throw error
            } else {
                this.logger.error(error.message, error.stack)
                throw new Error(AUTH_MESSAGES.LOGIN_GENERIC_ERROR)
            }
        }
    }

    logout(params: LogoutServiceParams): string | undefined {
        const { req, res } = params
        const cookies = req.cookies
        if (!cookies.jwt) {
            res.sendStatus(HttpStatus.OK)
            return
        }
        res.clearCookie('jwt', this.clearJwtCookieOptions)
        return AUTH_MESSAGES.LOGOUT_SUCCESS
    }

    async refresh(params: RefreshServiceParams): Promise<TAccessToken> {
        const { req } = params
        const refreshToken = this.authUtils.extractRefreshTokenFromCookie(req)
        try {
            const decoded = await this.jwtService.decodedToken(refreshToken)

            const user = await this.authUtils.validateUserForRefresh(decoded.userId)

            const payload = this.jwtService.createJwtPayload(user)
            const accessToken = await this.jwtService.signAccessToken(payload)

            return { accessToken }
        } catch (error) {
            if (error.name === 'TokenExpiredError') {
                throw new ForbiddenException(AUTH_MESSAGES.REFRESH_SESSION_EXPIRED)
            } else {
                throw new ForbiddenException(AUTH_MESSAGES.REFRESH_SESSION_INVALID)
            }
        }
    }
}
