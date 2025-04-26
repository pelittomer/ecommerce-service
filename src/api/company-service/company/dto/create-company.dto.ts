import { ApiProperty } from "@nestjs/swagger";
import { Transform } from "class-transformer";
import { IsNotEmpty, IsString } from "class-validator";
import { BaseCompanyDto } from "./base-company.dto";

export class CreateCompanyDto extends BaseCompanyDto {
    @ApiProperty({ description: 'Name of the company', example: 'TechCorp' })
    @IsString()
    @IsNotEmpty()
    @Transform(({ value }) => value.trim())
    name: string;

    @ApiProperty({ description: 'Tax ID of the company', example: '123456789' })
    @IsString()
    @IsNotEmpty()
    @Transform(({ value }) => value.trim())
    tax_id: string;

    @ApiProperty({ description: 'Tax office of the company', example: 'Downtown Tax Office' })
    @IsString()
    @IsNotEmpty()
    @Transform(({ value }) => value.trim())
    tax_office: string;
}