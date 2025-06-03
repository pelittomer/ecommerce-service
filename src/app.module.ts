import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import appConfig from './config/app';
import { MongooseModule } from '@nestjs/mongoose';
import { AppConfig } from './config/type';
import { JwtModule } from '@nestjs/jwt';
import { AuthModule } from './api/user-service/auth/auth.module';
import { UserModule } from './api/user-service/user/user.module';
import { ProfileModule} from './api/profile-service/profile/profile.module';
import { AddressModule } from './api/profile-service/address/address.module';
import { FavoriteModule } from './api/profile-service/favorite/favorite.module';
import { ProductModule } from './api/product-service/product/product.module';
import { CategoryModule } from './api/product-service/category/category.module';
import { BrandModule } from './api/product-service/brand/brand.module';
import { VariationModule } from './api/product-service/variation/variation.module';
import { OrderModule } from './api/order-cart-service/order/order.module';
import { CartModule } from './api/order-cart-service/cart/cart.module';
import { CompanyModule } from './api/company-service/company/company.module';
import { UploadModule } from './api/upload-service/upload/upload.module';
import { ReturnRequestModule } from './api/payment-transactions-service/return-request/return-request.module';
import { PaymentModule } from './api/payment-transactions-service/payment/payment.module';
import { QuestionModule } from './api/interaction-reviews-service/question/question.module';
import { ReviewModule } from './api/interaction-reviews-service/review/review.module';
import { ShipperModule } from './api/payment-transactions-service/shipper/shipper.module';
import { ScheduleModule } from '@nestjs/schedule';
import { LoggerModule } from './common/logging/logger.module';
import { minutes, seconds, ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';
import { APP_GUARD } from '@nestjs/core';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [appConfig]
    }),
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService<AppConfig>) => ({
        uri: configService.get('db.database_url', { infer: true })
      }),
      inject: [ConfigService]
    }),
    JwtModule.registerAsync({
      global: true,
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService<AppConfig>) => ({
        secret: configService.get('auth.secret_key', { infer: true })
      })
    }),
    ThrottlerModule.forRoot([
      {
        name: 'short',
        ttl: seconds(1),
        limit: 10,
      },
      {
        name: 'medium',
        ttl: seconds(60),
        limit: 100,
      },
      {
        name: 'long',
        ttl: minutes(5),
        limit: 500,
      },
    ]),
    ScheduleModule.forRoot(),
    AuthModule,
    UserModule,
    ProfileModule,
    AddressModule,
    FavoriteModule,
    ProductModule,
    CategoryModule,
    BrandModule,
    VariationModule,
    OrderModule,
    CartModule,
    CompanyModule,
    UploadModule,
    ReturnRequestModule,
    PaymentModule,
    QuestionModule,
    ReviewModule,
    ShipperModule,
    LoggerModule
  ],
  providers: [
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard
    }
  ],
})
export class AppModule { }
