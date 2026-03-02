import { ApiProperty } from "@nestjs/swagger";
import { IsDateString, IsOptional, IsString } from "class-validator";

export class UpdatePersonalInfoDto {
    @IsString()
    @ApiProperty({
        type: String,
        description: 'This is a required property',
        default: 'New Job Seeker',
    })
    full_name: string;

    @IsString()
    @ApiProperty({
        type: String,
        description: 'This is a required property',
        default: 'Surakarta',
    })
    address: string;

    @IsOptional()
    @IsString()
    @ApiProperty({
        type: String,
        description: 'This is a optional property',
        default: '081234567890',
    })
    phone_number: string;

    @IsOptional()
    @IsDateString()
    @ApiProperty({
        type: Date,
        description: 'This is a optional property',
        default: '1990-01-01',
    })
    date_of_birth: Date;
}
