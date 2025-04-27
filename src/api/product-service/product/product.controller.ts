import { Body, Controller, Get, Param, Post, Put, Req, UploadedFiles, UseGuards, UseInterceptors } from '@nestjs/common';
import { ProductService } from './product.service';
import { AuthGuard } from 'src/common/guards/auth.guard';
import { RolesGuard } from 'src/common/guards/roles.guard';
import { Role } from 'src/common/types';
import { Roles } from 'src/common/decorators/roles.decorator';
import { ParseObjectIdPipe } from '@nestjs/mongoose';
import { Types } from 'mongoose';
import { AnyFilesInterceptor } from '@nestjs/platform-express';
import { CreateProductDto } from './dto/create-product.dto';
import { ProductUtilsService } from './utils/product-utils.service';
import { Request } from 'express';

@Controller('product')
export class ProductController {
  constructor(
    private readonly productService: ProductService,
    private readonly productUtilsService: ProductUtilsService
  ) { }

  @UseGuards(AuthGuard, RolesGuard)
  @Roles(Role.Seller)
  @Post()
  @UseInterceptors(AnyFilesInterceptor())
  createProduct(
    @Body() userInputs: CreateProductDto,
    @Req() req: Request,
    @UploadedFiles() files: Express.Multer.File[]
  ) {
    const groupedFiles = this.productUtilsService.validateAndGroupUploadedFiles(files, true)
    return this.productService.createProduct(userInputs, req, groupedFiles)
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
