import { Body, Controller, Get, Param, Post, Put, Query, UploadedFiles, UseGuards, ValidationPipe } from '@nestjs/common';
import { CategoryService } from './category.service';
import { Roles } from 'src/common/decorators/roles.decorator';
import { Role } from 'src/common/types';
import { AuthGuard } from 'src/common/guards/auth.guard';
import { RolesGuard } from 'src/common/guards/roles.guard';
import { ParseObjectIdPipe } from '@nestjs/mongoose';
import { Types } from 'mongoose';
import { UploadCategoryImage } from './decorators/uploadCategoryImage';
import { CreateCategoryDto } from './dto/create-category.dto';
import { GetCategoryDto } from './dto/get-category.dto';

@Controller('category')
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) { }

  @UseGuards(AuthGuard, RolesGuard)
  @Roles(Role.Admin)
  @Post()
  @UploadCategoryImage()
  createCategory(
    @Body() userInputs: CreateCategoryDto,
    @UploadedFiles() files: { image: Express.Multer.File[], icon: Express.Multer.File[] }
  ) {
    return this.categoryService.createCategory(userInputs, files)
  }

  @Get('leafs')
  fetchLeafs() {
    return this.categoryService.findLeafs()
  }

  @Get('roots')
  fetchRoots() {
    return this.categoryService.findRoots()
  }

  @Get('tree')
  fetchTree(@Query(ValidationPipe) query: GetCategoryDto) {
    return this.categoryService.findTree(query.categoryId)
  }

  @UseGuards(AuthGuard, RolesGuard)
  @Roles(Role.Admin)
  @Put(':id')
  updateCategory(
    @Param('id', ParseObjectIdPipe) categoryId: Types.ObjectId
  ) {
    /*
     This function modifies the details of an existing category in the system.
    */
  }

}
