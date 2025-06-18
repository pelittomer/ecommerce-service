import { Body, Controller, Get, Param, Post, Put, Req, UploadedFile, UseGuards } from '@nestjs/common';
import { CompanyService } from './service/company.service';
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
    @Body() payload: CreateCompanyDto,
    @Req() req: Request,
    @UploadedFile() uploadedImage: Express.Multer.File
  ) {
    return this.companyService.createCompany({ payload, req, uploadedImage })
  }

  @UseGuards(AuthGuard, RolesGuard)
  @Roles(Role.Seller)
  @Put()
  @UploadImage()
  updateCompany(
    @Body() payload: UpdateCompanyDto,
    @Req() req: Request,
    @UploadedFile() uploadedImage: Express.Multer.File
  ) {
    return this.companyService.updateCompany({ payload, req, uploadedImage })
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
    @Body() payload: UpdateCompanyStatusDto,
    @Param('id', ParseObjectIdPipe) companyId: Types.ObjectId
  ) {
    return this.companyService.updateCompanyStatus({ payload, companyId })
  }

  @Get(':id')
  fetchCompanyById(@Param('id', ParseObjectIdPipe) companyId: Types.ObjectId) {
    return this.companyService.findCompany(companyId)
  }

  @UseGuards(AuthGuard,RolesGuard)
  @Roles(Role.Admin)
  @Get('/get/all')
  fetchAllCompany(){
    return this.companyService.fetchAllCompany()
  }
}
