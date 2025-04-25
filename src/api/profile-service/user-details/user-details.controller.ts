import { Body, Controller, Get, Put, Req, UploadedFile, UseGuards } from '@nestjs/common';
import { UserDetailsService } from './user-details.service';
import { AuthGuard } from 'src/common/guards/auth.guard';
import { RolesGuard } from 'src/common/guards/roles.guard';
import { Role } from 'src/common/types';
import { Roles } from 'src/common/decorators/roles.decorator';
import { UploadImage } from 'src/common/decorators/upload-image.decorator';
import { PartialUpdateUserDetailDto } from './dto/update-user-detail.dto';
import { Request } from 'express';

@Controller('user-details')
export class UserDetailsController {
  constructor(private readonly userDetailsService: UserDetailsService) { }

  @UseGuards(AuthGuard, RolesGuard)
  @Roles(Role.Customer)
  @UploadImage()
  @Put()
  updateDetails(
    @Body() userInputs: PartialUpdateUserDetailDto,
    @Req() req: Request,
    @UploadedFile() uploadedImage: Express.Multer.File
  ) {
    return this.userDetailsService.updateUserDetails(userInputs, req, uploadedImage)
  }

  @UseGuards(AuthGuard, RolesGuard)
  @Roles(Role.Customer)
  @Get()
  fetchDetails(@Req() req: Request) {
    return this.userDetailsService.findUserDetails(req)
  }

}
