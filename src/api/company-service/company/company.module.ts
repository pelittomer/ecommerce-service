import { Module } from '@nestjs/common';
import { CompanyService } from './company.service';
import { CompanyController } from './company.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Company, CompanySchema } from './schemas/company.schema';
import { UploadModule } from 'src/api/upload-service/upload/upload.module';
import { SharedUtilsModule } from 'src/common/utils/shared-utils.module';
import { CompanyRepository } from './company.repository';

@Module({
  controllers: [CompanyController],
  providers: [CompanyService, CompanyRepository],
  imports: [
    MongooseModule.forFeature([{ name: Company.name, schema: CompanySchema }]),
    UploadModule, SharedUtilsModule
  ]
})
export class CompanyModule { }
