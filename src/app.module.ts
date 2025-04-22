import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import appConfig from './config/app';
import { MongooseModule } from '@nestjs/mongoose';
import { AppConfig } from './config/type';
import { JwtModule } from '@nestjs/jwt';

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
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
