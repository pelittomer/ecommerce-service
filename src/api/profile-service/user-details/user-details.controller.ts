import { Controller, Get, Put, UseGuards } from '@nestjs/common';
import { UserDetailsService } from './user-details.service';
import { AuthGuard } from 'src/common/guards/auth.guard';
import { RolesGuard } from 'src/common/guards/roles.guard';
import { Role } from 'src/common/types';
import { Roles } from 'src/common/decorators/roles.decorator';

@Controller('user-details')
export class UserDetailsController {
  constructor(private readonly userDetailsService: UserDetailsService) { }

  @UseGuards(AuthGuard, RolesGuard)
  @Roles(Role.Customer)
  @Put()
  updateDetails() {
    /*
    This function allows the user to update their personal information, such as name, email, or other relevant details associated with their profile.
     */
  }

  @UseGuards(AuthGuard, RolesGuard)
  @Roles(Role.Customer)
  @Get()
  fetchDetails() {
    /*
    This function retrieves and displays the user's profile information.
    */
  }

}
