import { Controller, Get, Param, Post, Put, UseGuards } from '@nestjs/common';
import { CategoryService } from './category.service';
import { Roles } from 'src/common/decorators/roles.decorator';
import { Role } from 'src/common/types';
import { AuthGuard } from 'src/common/guards/auth.guard';
import { RolesGuard } from 'src/common/guards/roles.guard';
import { ParseObjectIdPipe } from '@nestjs/mongoose';
import { Types } from 'mongoose';

@Controller('category')
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) { }

  @UseGuards(AuthGuard, RolesGuard)
  @Roles(Role.Admin)
  @Post()
  createCategory() {
    /*
    This function adds a new category to the system.
    */
  }

  @Get('leafs')
  fetchLeafs() {
    /*
    This function retrieves and lists the leaf nodes of the category tree (categories that do not have any subcategories).
    */
  }

  @Get('roots')
  fetchRoots() {
    /*
    This function retrieves and lists the root nodes of the category tree (top-level categories).
    */
  }

  @Get('tree')
  fetchTree() {
    /*
      This function retrieves and displays the entire hierarchical structure of the categories.
    */
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
