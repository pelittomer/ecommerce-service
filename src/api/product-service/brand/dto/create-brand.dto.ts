import { ApiProperty } from "@nestjs/swagger";
import { Transform } from "class-transformer";
import { IsNotEmpty, IsString } from "class-validator";

export class CreateBrandDto {
    @ApiProperty({ description: 'Brand name', example: 'MyBrand' })
    @IsString()
    @IsNotEmpty()
    @Transform(({ value }) => value.trim())
    name: string;
}
