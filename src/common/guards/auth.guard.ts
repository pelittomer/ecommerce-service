import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';


@Injectable()
export class AuthGuard implements CanActivate {
    constructor(
        private jwtService: JwtService,
        private configService: ConfigService
    ) { }

    async canActivate(context: ExecutionContext): Promise<boolean> {
        const request = context.switchToHttp().getRequest()
        const token = this.extractTokenFromHeader(request)
        // Check if the authorization token exists
        if (!token) {
            throw new UnauthorizedException('You must log in to access this page.')
        }
        try {
            // Verify the JWT token
            const payload = await this.jwtService.verifyAsync(
                token,
                {
                    secret: this.configService.get<string>('TOKEN_SECRET_KEY')
                }
            )
            // Attach user information to the request object
            request['UserInfo'] = payload
        } catch {
            throw new UnauthorizedException('Your session has expired or you are using an invalid session. Please log in again.')
        }
        // If the token is valid, allow access to the route
        return true
    }
    // Extract the token from the authorization header
    private extractTokenFromHeader(request: Request): string | undefined {
        const [type, token] = request.headers.authorization?.split(' ') ?? []
        return type === 'Bearer' ? token : undefined
    }
}