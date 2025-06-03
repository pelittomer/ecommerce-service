import { Module } from '@nestjs/common';
import { FavoriteService } from './service/favorite.service';
import { FavoriteController } from './favorite.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Favorite, FavoriteSchema } from './entities/favorite.entity';
import { SharedUtilsModule } from 'src/common/utils/shared-utils.module';
import { ProductModule } from 'src/api/product-service/product/product.module';
import { FavoriteRepository } from './repository/favorite.repository';
import { FavoriteUtils } from './utils/favorite.utils';

@Module({
  controllers: [FavoriteController],
  providers: [FavoriteService, FavoriteRepository, FavoriteUtils],
  imports: [
    MongooseModule.forFeature([{ name: Favorite.name, schema: FavoriteSchema }]),
    SharedUtilsModule, ProductModule
  ]
})
export class FavoriteModule { }
