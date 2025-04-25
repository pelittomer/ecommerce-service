import { ApiProperty } from "@nestjs/swagger";
import { Transform } from "class-transformer";
import { IsNotEmpty, IsOptional, IsString } from "class-validator";

export class CreateAddressDto {
    @ApiProperty({ description: 'City of the address', example: 'Istanbul' })
    @IsNotEmpty()
    @IsString()
    @Transform(({ value }) => value.trim())
    city: string;

    @ApiProperty({ description: 'District of the address', example: 'Besiktas' })
    @IsNotEmpty()
    @IsString()
    @Transform(({ value }) => value.trim())
    district: string;

    @ApiProperty({ description: 'Neighborhood of the address', example: 'Yildiz' })
    @IsNotEmpty()
    @IsString()
    @Transform(({ value }) => value.trim())
    neighborhood: string;

    @ApiProperty({ description: 'Street of the address', example: 'Barbaros Bulvari' })
    @IsNotEmpty()
    @IsString()
    @Transform(({ value }) => value.trim())
    street: string;

    @ApiProperty({ description: 'Building number of the address (optional)', example: '10', required: false })
    @Transform(({ value }) => value.trim())
    @IsString()
    @IsOptional()
    building_number: string;

    @ApiProperty({ description: 'Door number of the address', example: '5' })
    @IsNotEmpty()
    @IsString()
    @Transform(({ value }) => value.trim())
    door_number: string;

    @ApiProperty({ description: 'Phone number associated with the address', example: '5551234567' })
    @IsNotEmpty()
    @IsString()
    @Transform(({ value }) => value.trim())
    phone: string;
}
