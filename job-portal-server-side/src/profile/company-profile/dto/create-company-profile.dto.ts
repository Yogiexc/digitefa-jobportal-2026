import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsOptional, IsString } from "class-validator";

export class CreateCompanyProfileDto {
    @ApiProperty({
        type: 'string',
        format: 'binary',
        description: 'Upload Logo Company File (jpg, jpeg, png)',
        default: 'File Logo Company'
    })
    upload_logo?: any;

    @IsNotEmpty()
    @IsString()
    @ApiProperty({
        type: String,
        description: 'Market Name of the company',
        required: true,
        default: 'KODEGIRI',
    })
    market_name: string;

    @ApiProperty({
        type: String,
        description: 'Category of the company',
        required: true,
        default: 'Technology',
    })
    @IsNotEmpty()
    @IsString()
    category: string;

    @ApiProperty({
        type: String,
        description: 'Size of the company',
        required: true,
        default: '1-10',
    })
    @IsNotEmpty()
    @IsString()
    company_size: string;

    @ApiProperty({
        type: String,
        description: 'Description of the company',
        required: true,
        default: 'KODEGIRI is a technology company that focuses on developing software products.',
    })
    @IsNotEmpty()
    @IsString()
    description: string;

    @ApiProperty({
        type: String,
        description: 'Country where the company is located',
        required: true,
        default: 'Indonesia',
    })
    @IsNotEmpty()
    @IsString()
    country: string;

    @ApiProperty({
        type: String,
        description: 'Province where the company is located',
        required: true,
        default: 'Central Java',
    })
    @IsNotEmpty()
    @IsString()
    province: string;

    @ApiProperty({
        type: String,
        description: 'City where the company is located',
        required: true,
        default: 'Yogyakarta',
    })
    @IsNotEmpty()
    @IsString()
    city: string;

    @ApiProperty({
        type: String,
        description: 'District where the company is located',
        required: true,
        default: 'Sleman',
    })
    @IsNotEmpty()
    @IsString()
    district: string;

    @ApiProperty({
        type: String,
        description: 'Full address of the company',
        required: true,
        default: 'Jalan Waras, Panggung Sari, Sariharjo, Ngaglik',
    })
    @IsNotEmpty()
    @IsString()
    full_address: string;

    @ApiProperty({
        type: String,
        description: 'Postal code of the company location',
        required: true,
        default: '55284',
    })
    @IsNotEmpty()
    @IsString()
    postal_code: string;

    @ApiProperty({
        type: String,
        description: 'Website of the company',
        required: false,
    })
    @IsOptional()
    @IsString()
    website?: string;

    @ApiProperty({
        type: String,
        description: 'Facebook URL of the company',
        required: false,
    })
    @IsOptional()
    @IsString()
    facebook_url?: string;

    @ApiProperty({
        type: String,
        description: 'Twitter URL of the company',
        required: false,
    })
    @IsOptional()
    @IsString()
    twitter_url?: string;

    @ApiProperty({
        type: String,
        description: 'Instagram URL of the company',
        required: false,
    })
    @IsOptional()
    @IsString()
    instagram_url?: string;

    @ApiProperty({
        type: String,
        description: 'YouTube URL of the company',
        required: false,
    })
    @IsOptional()
    @IsString()
    youtube_url?: string;
}
