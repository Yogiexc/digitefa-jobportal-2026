import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsOptional, IsString } from "class-validator";

export class CreateUniversityProfileDto {
    @IsOptional()
    @ApiProperty({
        type: 'string',
        format: 'binary',
        description: 'Upload Logo Company File (jpg, jpeg, png)',
        default: 'File Logo University',
    })
    upload_logo?: any;

    @IsNotEmpty()
    @IsString()
    @ApiProperty({
        type: String,
        description: 'This is a required property',
        required: true,
        default: '0123456789',
    })
    phone_number: string;

    @IsNotEmpty()
    @IsString()
    @ApiProperty({
        type: String,
        description: 'This is a required property',
        required: true,
        default: 'State University',
    })
    category: string;

    @IsOptional()
    @IsString()
    @ApiProperty({
        type: String,
        description: 'This is a required property',
        required: true,
        default: 'Indonesia',
    })
    country: string;

    @IsOptional()
    @IsString()
    @ApiProperty({
        type: String,
        description: 'This is a required property',
        required: true,
        default: 'Central Java',
    })
    province: string;

    @IsOptional()
    @IsString()
    @ApiProperty({
        type: String,
        description: 'This is a required property',
        required: true,
        default: 'Surakarta',
    })
    city: string;

    @IsOptional()
    @IsString()
    @ApiProperty({
        type: String,
        description: 'This is a required property',
        required: true,
        default: 'Jebres',
    })
    district: string;

    @IsOptional()
    @IsString()
    @ApiProperty({
        type: String,
        description: 'This is a required property',
        required: true,
        default: 'Jalan Ir. Sutami No.36',
    })
    full_address: string;

    @IsOptional()
    @IsString()
    @ApiProperty({
        type: String,
        description: 'This is a required property',
        required: true,
        default: '57126',
    })
    postal_code: string;

    @IsOptional()
    @IsString()
    @ApiProperty({
        type: String,
        description: 'This is a optional property',
    })
    website: string;

    @IsOptional()
    @IsString()
    @ApiProperty({
        type: String,
        description: 'This is a optional property',
    })
    facebook_url: string;

    @IsOptional()
    @IsString()
    @ApiProperty({
        type: String,
        description: 'This is a optional property',
    })
    twitter_url: string;

    @IsOptional()
    @IsString()
    @ApiProperty({
        type: String,
        description: 'This is a optional property',
    })
    instagram_url: string;

    @IsOptional()
    @IsString()
    @ApiProperty({
        type: String,
        description: 'This is a optional property',
    })
    youtube_url: string;
}
