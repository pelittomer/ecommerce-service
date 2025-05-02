import { Catch, ArgumentsHost, HttpException, HttpStatus, Logger } from '@nestjs/common';
import { BaseExceptionFilter } from '@nestjs/core';
import { Response } from 'express';

@Catch(HttpException)
export class SignInRateLimitExceptionFilter extends BaseExceptionFilter {
    private readonly logger = new Logger(SignInRateLimitExceptionFilter.name)

    catch(exception: HttpException, host: ArgumentsHost) {
        const ctx = host.switchToHttp()
        const response = ctx.getResponse<Response>()
        const request = ctx.getRequest<Request>()
        const statusCode = exception.getStatus()
        const requestId = request.headers["X-Request-Id"]

        if (statusCode === HttpStatus.TOO_MANY_REQUESTS) {
            this.logger.error(`Http Exception Filter: ${exception?.message}`, {
                exception,
                body: request.body,
                headers: request.headers,
                url: request.url,
                method: request.method,
                requestId,
            })

            response.status(statusCode).json({
                status: statusCode,
                timestamp: new Date().toISOString(),
                path: request.url,
                error: {
                    code: exception.name,
                    message: 'Too many login attempts. Please wait a moment and try again.',
                    details: exception.getResponse()
                },
            })
        } else {
            super.catch(exception, host)
        }
    }
}