import { ApiProperty } from "@nestjs/swagger";
import { Transform } from "class-transformer";
import { IsEmail, IsNotEmpty, IsString } from "class-validator";

export class BaseCompanyDto {
    @ApiProperty({ description: 'Description of the company', example: 'A leading tech solutions provider.' })
    @IsString()
    @IsNotEmpty()
    @Transform(({ value }) => value.trim())
    description: string;

    @ApiProperty({ description: 'Website URL of the company', example: 'https://www.techcorp.com' })
    @IsString()
    @Transform(({ value }) => value.trim())
    website: string;

    @ApiProperty({ description: 'Phone number of the company', example: '+123456789' })
    @IsString()
    @IsNotEmpty()
    @Transform(({ value }) => value.trim())
    phone: string;

    @ApiProperty({ description: 'Email address of the company', example: 'info@techcorp.com' })
    @IsEmail()
    @IsNotEmpty()
    @Transform(({ value }) => value.trim())
    email: string;

    @ApiProperty({ description: 'Address of the company', example: '123 Tech Street, Silicon Valley' })
    @IsString()
    @IsNotEmpty()
    @Transform(({ value }) => value.trim())
    address: string;
}