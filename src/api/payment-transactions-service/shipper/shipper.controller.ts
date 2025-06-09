import { Body, Controller, Get, Post, UploadedFile, UseGuards } from '@nestjs/common';
import { ShipperService } from './service/shipper.service';
import { Roles } from 'src/common/decorators/roles.decorator';
import { Role } from 'src/common/types';
import { AuthGuard } from 'src/common/guards/auth.guard';
import { RolesGuard } from 'src/common/guards/roles.guard';
import { UploadImage } from 'src/common/decorators/upload-image.decorator';
import { CreateShipperDto } from './dto/create-shipper.dto';

@Controller('shipper')
export class ShipperController {
  constructor(private readonly shipperService: ShipperService) { }

  @UseGuards(AuthGuard, RolesGuard)
  @Roles(Role.Admin)
  @Post()
  @UploadImage()
  createShipper(
    @Body() payload: CreateShipperDto,
    @UploadedFile() uploadedImage: Express.Multer.File
  ) {
    return this.shipperService.createShipper({ payload, uploadedImage })
  }

  @UseGuards(AuthGuard, RolesGuard)
  @Roles(Role.Seller)
  @Get()
  fetchShipper() {
    return this.shipperService.findShippers()
  }

}
