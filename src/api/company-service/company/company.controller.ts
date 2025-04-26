import { Body, Controller, Get, Param, Post, Put, Req, UploadedFile, UseGuards } from '@nestjs/common';
import { CompanyService } from './company.service';
import { Roles } from 'src/common/decorators/roles.decorator';
import { Role } from 'src/common/types';
import { AuthGuard } from 'src/common/guards/auth.guard';
import { RolesGuard } from 'src/common/guards/roles.guard';
import { ParseObjectIdPipe } from '@nestjs/mongoose';
import { Types } from 'mongoose';
import { UploadImage } from 'src/common/decorators/upload-image.decorator';
import { CreateCompanyDto } from './dto/create-company.dto';
import { Request } from 'express';
import { UpdateCompanyDto } from './dto/update-company.dto';
import { UpdateCompanyStatusDto } from './dto/update-company-status.dto';

@Controller('company')
export class CompanyController {
  constructor(private readonly companyService: CompanyService) { }

  @UseGuards(AuthGuard, RolesGuard)
  @Roles(Role.Seller)
  @Post()
  @UploadImage()
  createCompany(
    @Body() userInputs: CreateCompanyDto,
    @Req() req: Request,
    @UploadedFile() uploadedImage: Express.Multer.File
  ) {
    return this.companyService.createCompany(userInputs, req, uploadedImage)
  }

  @UseGuards(AuthGuard, RolesGuard)
  @Roles(Role.Seller)
  @Put()
  @UploadImage()
  updateCompany(
    @Body() userInputs: UpdateCompanyDto,
    @Req() req: Request,
    @UploadedFile() uploadedImage: Express.Multer.File
  ) {
    return this.companyService.updateCompany(userInputs, req, uploadedImage)
  }

  @UseGuards(AuthGuard, RolesGuard)
  @Roles(Role.Seller)
  @Get()
  fetchCompany(@Req() req: Request) {
    return this.companyService.getAuthenticatedCompany(req)
  }

  @UseGuards(AuthGuard, RolesGuard)
  @Roles(Role.Admin)
  @Put(':id')
  updateCompanyStatus(
    @Body() userInputs: UpdateCompanyStatusDto,
    @Param('id', ParseObjectIdPipe) companyId: Types.ObjectId
  ) {
    return this.companyService.updateCompanyStatus(userInputs, companyId)
  }

  @Get(':id')
  fetchCompanyById(
    @Param('id', ParseObjectIdPipe) companyId: Types.ObjectId
  ) {
    /*
    This function retrieves and returns the detailed information for a specific company, identified by its ID.
    */
  }

}
