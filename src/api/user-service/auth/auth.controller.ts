import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthGuard } from 'src/common/guards/auth.guard';
import { RoleParam } from './lib/role-validation.pipe';
import { UserRole } from './types';
import { Role } from 'src/common/types';
import { RegisterDto } from './dto/register.dto';

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
    @RoleParam() roleParam: UserRole
  ) {
    /*
    This function allows existing users to access their accounts by verifying their credentials (usually email and password). Upon successful verification, it establishes a session or issues an access token.
    */

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
