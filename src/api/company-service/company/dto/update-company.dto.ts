import { PartialType } from '@nestjs/swagger';
import { BaseCompanyDto } from './base-company.dto';

export class UpdateCompanyDto extends PartialType(BaseCompanyDto) {}
