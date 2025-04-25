import { BadRequestException, ForbiddenException, HttpStatus, Injectable, Logger, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { RegisterDto } from './dto/register.dto';
import { Role } from 'src/common/types';
import { UserRepository } from '../user/user.repository';
import { compare, genSalt, hash } from 'bcrypt';
import { LoginDto } from './dto/login.dto';
import { CookieOptions, Request, Response } from 'express';
import { Types } from 'mongoose';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { AppConfig } from 'src/config/type';

@Injectable()
export class AuthService {
    constructor(
        private readonly userRepository: UserRepository,
        private readonly jwtService: JwtService,
        private readonly configService: ConfigService<AppConfig>
    ) { }

    private readonly logger = new Logger(AuthService.name)
    private readonly accessTokenExpiresIn = '15m'
    private readonly refreshTokenExpiresIn = '7d'
    private readonly jwtCookieOptions: CookieOptions = {
        httpOnly: true,
        secure: true,
        sameSite: 'none',
        maxAge: 7 * 24 * 60 * 60 * 1000,
    }

    private handleAuthError(error) {
        if (error instanceof BadRequestException || error instanceof NotFoundException || error instanceof UnauthorizedException) {
            this.logger.warn(error.message, error.stack);
            throw error;
        } else {
            this.logger.error(error.message, error.stack);
            throw new Error('Something went wrong. Please try again.');
        }
    }

    async register(userInputs: RegisterDto, role: Exclude<Role, Role.Admin>): Promise<string> {
        const { username, email, password } = userInputs

        const userExists = await this.userRepository.findByOrQuery({ username, email })
        if (userExists) {
            if (userExists.username === username) {
                throw new BadRequestException('This username is already in use. Please choose another username.')
            } else if (userExists.email === email) {
                throw new BadRequestException('This email address is already registered. Please use a different email address.')
            }
        }

        //Hash the password
        const salt = await genSalt()
        const hashedPassword = await hash(password, salt)

        const user = await this.userRepository.create({
            ...userInputs,
            password: hashedPassword,
        }, role)

        this.logger.log(`User registration completed successfully: username=${username}, userId=${user._id}, role=${role}`)

        return 'Your registration is complete. You can now log in.'
    }

    async login(userInputs: LoginDto, role: Role, res: Response) {
        const { email, password } = userInputs

        try {
            const foundUser = await this.userRepository.findOne({ email })
            // Check if user exists
            if (!foundUser) {
                throw new NotFoundException('A user with the entered email address was not found. Please check your email address or register.')
            }

            if (foundUser.roles !== role && foundUser.roles !== Role.Admin) {
                throw new BadRequestException('You are not authorized to perform this operation.')
            }

            // Compare provided password with hashed password
            const matchPassword = await compare(password, foundUser.password)
            // Check if passwords match
            if (!matchPassword) {
                throw new UnauthorizedException('The password you entered is incorrect. Please check your password and try again.')
            }

            // Create payload for JWT
            const payload = {
                username: foundUser.username,
                userId: foundUser._id as Types.ObjectId,
                roles: foundUser.roles,
            }

            // Generate token
            const accessToken = this.jwtService.sign(payload, { expiresIn: this.accessTokenExpiresIn })
            const refreshToken = this.jwtService.sign(payload, { expiresIn: this.refreshTokenExpiresIn })

            // Set cookie here
            res.cookie('jwt', refreshToken, this.jwtCookieOptions)

            return { accessToken }
        } catch (error) {
            this.handleAuthError(error)
        }
    }

    logout(req: Request, res: Response) {
        const cookies = req.cookies
        // Check if JWT cookie exists
        if (!cookies.jwt) {
            res.sendStatus(HttpStatus.OK)
            return
        }
        // Clear the JWT cookie
        res.clearCookie('jwt', {
            httpOnly: true,
            sameSite: 'none',
            secure: true
        })

        return 'You have successfully logged out.'
    }

    async refresh(req: Request, res: Response) {
        const cookies = req.cookies
        // Check if refresh token cookie exists
        if (!cookies.jwt) {
            throw new UnauthorizedException('The information required to refresh your session was not found. Please log in again.')
        }

        const refreshToken = cookies.jwt

        try {
            // Verify refresh token
            const decoded = await this.jwtService.verifyAsync(refreshToken, {
                secret: this.configService.get('auth.secret_key', { infer: true }),
            })
            // Find user by decoded userId
            const foundUser = await this.userRepository.findById(decoded.userId)
            if (!foundUser) {
                throw new UnauthorizedException('Your user account could not be verified. Please log in again.')
            }
            // Create new access token payload
            const payload = {
                username: foundUser.username,
                userId: foundUser._id,
                roles: foundUser.roles,
            }
            // Generate new access token
            const accessToken = this.jwtService.sign(payload, { expiresIn: this.accessTokenExpiresIn })

            return { accessToken }
        } catch (error) {
            if (error.name === 'TokenExpiredError') {
                throw new ForbiddenException('Your session has expired. Please log in again.')
            } else {
                throw new ForbiddenException('Your session could not be verified. Please log in again.')
            }
        }
    }

}
