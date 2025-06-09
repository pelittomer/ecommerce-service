import { Module } from '@nestjs/common';
import { CompanyService } from './service/company.service';
import { CompanyController } from './company.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Company, CompanySchema } from './entities/company.entity';
import { UploadModule } from 'src/api/upload-service/upload/upload.module';
import { SharedUtilsModule } from 'src/common/utils/shared-utils.module';
import { CompanyRepository } from './repository/company.repository';
import { CompanyUtilsService } from './utils/company-utils.service';

@Module({
  controllers: [CompanyController],
  providers: [CompanyService, CompanyRepository, CompanyUtilsService],
  imports: [
    MongooseModule.forFeature([{ name: Company.name, schema: CompanySchema }]),
    UploadModule, SharedUtilsModule
  ],
  exports: [CompanyRepository]
})
export class CompanyModule { }
