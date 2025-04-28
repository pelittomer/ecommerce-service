import { Body, Controller, Get, Param, Post, Put, Query, Req, UploadedFiles, UseGuards, UseInterceptors } from '@nestjs/common';
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
import { UpdateProductDto } from './dto/update-product.dto';
import { PartialGetProductDto } from './dto/get-product.dto';

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
  @Put(':id')
  @UseInterceptors(AnyFilesInterceptor())
  updateProduct(
    @Body() userInputs: UpdateProductDto,
    @Req() req: Request,
    @UploadedFiles() files: Express.Multer.File[],
    @Param('id', ParseObjectIdPipe) productId: Types.ObjectId
  ) {
    const groupedFiles = this.productUtilsService.validateAndGroupUploadedFiles(files)
    return this.productService.updateProduct(userInputs, req, groupedFiles, productId)
  }

  @Get(':id')
  fetchProductDetails(@Param('id', ParseObjectIdPipe) productId: Types.ObjectId) {
    return this.productService.findProductDetails(productId)
  }

  @Get()
  fetchProduct(@Query() query: PartialGetProductDto) {
    return this.productService.findProducts(query)
  }

}
