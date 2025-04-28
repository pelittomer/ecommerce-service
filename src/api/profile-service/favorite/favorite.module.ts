import { Module } from '@nestjs/common';
import { FavoriteService } from './favorite.service';
import { FavoriteController } from './favorite.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Favorite, FavoriteSchema } from './schemas/favorite.schema';
import { FavoriteRepository } from './favorite.repository';
import { SharedUtilsModule } from 'src/common/utils/shared-utils.module';
import { ProductModule } from 'src/api/product-service/product/product.module';

@Module({
  controllers: [FavoriteController],
  providers: [FavoriteService, FavoriteRepository],
  imports: [
    MongooseModule.forFeature([{ name: Favorite.name, schema: FavoriteSchema }]),
    SharedUtilsModule, ProductModule
  ]
})
export class FavoriteModule { }
