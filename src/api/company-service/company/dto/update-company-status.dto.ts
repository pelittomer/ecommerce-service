import { ApiProperty } from "@nestjs/swagger";
import { Transform } from "class-transformer";
import { IsEnum, IsNotEmpty, IsOptional, IsString } from "class-validator";
import { CompanyStatus } from "src/common/types";

export class UpdateCompanyStatusDto {
    @ApiProperty({ description: 'The current status of the company', example: CompanyStatus.Approved })
    @IsNotEmpty()
    @IsEnum(CompanyStatus)
    @Transform(({ value }) => value.trim())
    status: CompanyStatus;

    @ApiProperty({ description: 'Reason for rejecting the status change', example: 'Missing required documents' })
    @IsString()
    @IsOptional()
    @IsNotEmpty()
    @Transform(({ value }) => value.trim())
    rejection_reason: string;
}