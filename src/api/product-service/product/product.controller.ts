import { Controller, Get, Param, Post, Put, UseGuards } from '@nestjs/common';
import { ProductService } from './product.service';
import { AuthGuard } from 'src/common/guards/auth.guard';
import { RolesGuard } from 'src/common/guards/roles.guard';
import { Role } from 'src/common/types';
import { Roles } from 'src/common/decorators/roles.decorator';
import { ParseObjectIdPipe } from '@nestjs/mongoose';
import { Types } from 'mongoose';

@Controller('product')
export class ProductController {
  constructor(private readonly productService: ProductService) { }

  @UseGuards(AuthGuard, RolesGuard)
  @Roles(Role.Seller)
  @Post()
  createProduct() {
    /*
    This function adds a new product to the system. It typically involves providing details such as name, description, price, and other relevant attributes.
    */
  }

  @UseGuards(AuthGuard, RolesGuard)
  @Roles(Role.Seller)
  @Put()
  updateProduct() {
    /*
    This function modifies the details of an existing product in the system. It usually requires the product's ID and the updated information.
    */
  }

  @Get(':id')
  fetchProductDetails(
    @Param('id', ParseObjectIdPipe) productId: Types.ObjectId
  ) {
    /*
    This function retrieves and displays the details of a specific product based on the provided product ID.
    */
  }

  @Get()
  fetchProduct() {
    /*
    This function retrieves and lists products based on specified filters or criteria. These filters could include categories, price range, or other product attributes.
    */
  }

}
