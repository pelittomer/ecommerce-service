import { Body, Controller, Get, Post, Res, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthGuard } from 'src/common/guards/auth.guard';
import { RoleParam } from './lib/role-validation.pipe';
import { UserRole } from './types';
import { Role } from 'src/common/types';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { Response } from 'express';

@Controller('user/auth')
export class AuthController {
  constructor(private readonly authService: AuthService) { }

  private mapRoleParamToEnum(roleParam: UserRole): Exclude<Role, Role.Admin> {
    return roleParam === 'customer' ? Role.Customer : Role.Seller;
  }

  @Post(':role/sign-up')
  signUp(
    @Body() userInputs: RegisterDto,
    @RoleParam() roleParam: UserRole
  ) {
    const role = this.mapRoleParamToEnum(roleParam)
    return this.authService.register(userInputs, role)
  }

  @Post(':role/sign-in')
  signIn(
    @Body() userInputs: LoginDto,
    @RoleParam() roleParam: UserRole,
    @Res({ passthrough: true }) res: Response
  ) {
    const role = this.mapRoleParamToEnum(roleParam)
    return this.authService.login(userInputs, role, res)
  }

  @UseGuards(AuthGuard)
  @Post('sign-out')
  signOut() {
    /*
    This function terminates the user's current session or invalidates their access token, effectively logging them out of the system.
    */
  }

  @Get('refresh')
  refresh() {
    /*
    This function is used to obtain a new access token without requiring the user to log in again. This is often done using a refresh token, which has a longer lifespan than the access token.
    */

  }

}
