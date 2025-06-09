import { Body, Controller, Get, Post, Query, UploadedFiles, UseGuards, ValidationPipe } from '@nestjs/common';
import { CategoryService } from './service/category.service';
import { Roles } from 'src/common/decorators/roles.decorator';
import { Role } from 'src/common/types';
import { AuthGuard } from 'src/common/guards/auth.guard';
import { RolesGuard } from 'src/common/guards/roles.guard';
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
    @Body() payload: CreateCategoryDto,
    @UploadedFiles() uploadedImage: { image: Express.Multer.File[], icon: Express.Multer.File[] }
  ) {
    return this.categoryService.createCategory({ payload, uploadedImage })
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
}
