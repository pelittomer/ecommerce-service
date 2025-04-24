import { Controller, Get, Param, UseGuards } from '@nestjs/common';
import { UserService } from './user.service';
import { AuthGuard } from 'src/common/guards/auth.guard';
import { ParseObjectIdPipe } from '@nestjs/mongoose';
import { Types } from 'mongoose';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) { }

  @UseGuards(AuthGuard)
  @Get(':id')
  fetchUser(
    @Param('id', ParseObjectIdPipe) userId: Types.ObjectId
  ) {
    /*
    This function retrieves user information based on a provided user ID. It's commonly used to fetch details of a specific user from the system's database.
    */
  }
}
