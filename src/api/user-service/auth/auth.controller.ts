import { Body, Controller, Get, Post, Req, Res, UseFilters, UseGuards } from '@nestjs/common';
import { AuthService } from './service/auth.service';
import { AuthGuard } from 'src/common/guards/auth.guard';
import { RoleParam } from './lib/pipe/role-validation.pipe';
import { UserRole } from './types';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { Request, Response } from 'express';
import { hours, minutes, seconds, Throttle } from '@nestjs/throttler';
import { SignInRateLimitExceptionFilter } from './lib/filter/signInExceptionFilter';
import { AuthUtils } from './utils/auth.utils';

@Controller('user/auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly authUtils: AuthUtils,
  ) { }

  @Post(':role/sign-up')
  signUp(
    @Body() userInputs: RegisterDto,
    @RoleParam() roleParam: UserRole
  ) {
    const roles = this.authUtils.mapRoleParamToEnum(roleParam)
    return this.authService.register({ ...userInputs, roles })
  }

  @UseFilters(SignInRateLimitExceptionFilter)
  @Throttle({
    short: { ttl: seconds(60), limit: 3 },
    medium: { ttl: minutes(60), limit: 6 },
    long: { ttl: hours(24), limit: 9 },
  })
  @Post(':role/sign-in')
  signIn(
    @Body() userInputs: LoginDto,
    @RoleParam() roleParam: UserRole,
    @Res({ passthrough: true }) res: Response
  ) {
    const roles = this.authUtils.mapRoleParamToEnum(roleParam)
    return this.authService.login({ ...userInputs, roles, res })
  }

  @UseGuards(AuthGuard)
  @Post('sign-out')
  signOut(
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response
  ) {
    return this.authService.logout({ req, res })
  }

  @Get('refresh')
  refresh(@Req() req: Request) {
    return this.authService.refresh({ req })
  }
}
