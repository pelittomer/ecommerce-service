import { Module } from '@nestjs/common';
import { AuthService } from './service/auth.service';
import { AuthController } from './auth.controller';
import { UserModule } from '../user/user.module';
import { AuthUtils } from './utils/auth.utils';
import { BcryptModule } from 'src/modules/bcrypt/bcrypt.module';
import { JwtModule } from 'src/modules/jwt/jwt.module';

@Module({
  controllers: [AuthController],
  providers: [AuthService, AuthUtils],
  imports: [UserModule, BcryptModule, JwtModule]
})
export class AuthModule { }
