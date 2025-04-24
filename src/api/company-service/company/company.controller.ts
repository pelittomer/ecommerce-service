import { Controller, Get, Param, Post, Put, UseGuards } from '@nestjs/common';
import { CompanyService } from './company.service';
import { Roles } from 'src/common/decorators/roles.decorator';
import { Role } from 'src/common/types';
import { AuthGuard } from 'src/common/guards/auth.guard';
import { RolesGuard } from 'src/common/guards/roles.guard';
import { ParseObjectIdPipe } from '@nestjs/mongoose';
import { Types } from 'mongoose';

@Controller('company')
export class CompanyController {
  constructor(private readonly companyService: CompanyService) { }

  @UseGuards(AuthGuard, RolesGuard)
  @Roles(Role.Seller)
  @Post()
  createCompany() {
    /*
    This function adds a new company to the system.
    */
  }

  @UseGuards(AuthGuard, RolesGuard)
  @Roles(Role.Seller)
  @Put()
  updateCompany() {
    /*
    This function updates the information of a specific company, identified by its ID.
    */
  }

  @UseGuards(AuthGuard, RolesGuard)
  @Roles(Role.Seller)
  @Get()
  fetchCompany() {
    /*
    This function retrieves and returns the company associated with the authenticated user.
    */
  }

  @UseGuards(AuthGuard, RolesGuard)
  @Roles(Role.Admin)
  @Put(':id')
  updateCompanyStatus(
    @Param('id', ParseObjectIdPipe) companyId: Types.ObjectId
  ) {
    /*
    This function updates the status of a specific company (e.g., active, inactive).
    */
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
