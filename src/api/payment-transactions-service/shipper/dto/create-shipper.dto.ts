import { ApiProperty } from "@nestjs/swagger";
import { Transform } from "class-transformer";
import { IsNotEmpty, IsString } from "class-validator";

export class CreateShipperDto {
    @ApiProperty({ description: "Name of the shipper", example: "Global Shipper Co." })
    @IsString()
    @IsNotEmpty()
    @Transform(({ value }) => value.trim())
    name: string;

    @ApiProperty({ description: "Description of the shipper", example: "Leading logistics provider" })
    @IsString()
    @IsNotEmpty()
    @Transform(({ value }) => value.trim())
    description: string;

    @ApiProperty({ description: "Website URL of the shipper", example: "https://globalshipper.com" })
    @IsString()
    @IsNotEmpty()
    @Transform(({ value }) => value.trim())
    website: string;

    @ApiProperty({ description: "Phone number of the shipper", example: "+1-555-123-4567" })
    @IsString()
    @IsNotEmpty()
    @Transform(({ value }) => value.trim())
    phone: string;

    @ApiProperty({ description: "Email address of the shipper", example: "info@globalshipper.com" })
    @IsString()
    @IsNotEmpty()
    @Transform(({ value }) => value.trim())
    email: string;

    @ApiProperty({ description: "Address of the shipper", example: "123 Shipping Lane, Logistics City" })
    @IsString()
    @IsNotEmpty()
    @Transform(({ value }) => value.trim())
    address: string;
}
