import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from "@nestjs/common";
import { map, Observable } from "rxjs";

export interface ApiResponse<T> {
    statusCode: number;
    message?: string;
    data: T;
    meta?: {
        total?: number;
        page?: number;
        limit?: number;
    };
}

@Injectable()
export class TransformInterceptor<T>
    implements NestInterceptor<T, ApiResponse<T>> {
    intercept(
        context: ExecutionContext,
        next: CallHandler,
    ): Observable<ApiResponse<T>> {
        return next.handle().pipe(
            map((data) => {
                const statusCode = context.switchToHttp().getResponse().statusCode;
                const message =
                    data?.message ||
                    (statusCode >= 200 && statusCode < 300
                        ? 'Request successful'
                        : 'Operation failed')


                const responseData = data?.data !== undefined ? data.data : data
                const metaData = data?.meta
                return {
                    statusCode,
                    message,
                    data: responseData,
                    ...(metaData && { meta: metaData }),
                }
            }),
        )
    }
}