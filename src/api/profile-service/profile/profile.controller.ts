import { Body, Controller, Get, Put, Req, UploadedFile, UseGuards } from '@nestjs/common';
import { AuthGuard } from 'src/common/guards/auth.guard';
import { RolesGuard } from 'src/common/guards/roles.guard';
import { Role } from 'src/common/types';
import { Roles } from 'src/common/decorators/roles.decorator';
import { UploadImage } from 'src/common/decorators/upload-image.decorator';
import { Request } from 'express';
import { ProfileService } from './service/proflie.service';
import { PartialUpdateProfileDto } from './dto/update-profile.dto';

@Controller('user-details')
export class ProfileController {
  constructor(private readonly profileService: ProfileService) { }

  @UseGuards(AuthGuard, RolesGuard)
  @Roles(Role.Customer)
  @UploadImage()
  @Put()
  updateDetails(
    @Body() payload: PartialUpdateProfileDto,
    @Req() req: Request,
    @UploadedFile() uploadedImage: Express.Multer.File
  ) {
    return this.profileService.updateProfile({ payload, req, uploadedImage })
  }

  @UseGuards(AuthGuard, RolesGuard)
  @Roles(Role.Customer)
  @Get()
  fetchDetails(@Req() req: Request) {
    return this.profileService.findProfile(req)
  }
}
