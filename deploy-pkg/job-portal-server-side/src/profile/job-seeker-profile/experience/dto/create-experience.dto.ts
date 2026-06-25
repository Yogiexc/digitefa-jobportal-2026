import { ApiProperty } from "@nestjs/swagger";
import { IsOptional, IsString, MaxLength } from "class-validator";

export class CreateExperienceDto {
    @IsString()
    @ApiProperty({
        type: 'string',
        description: 'This is a required property',
        default: "Experience Title",
    })
    experience_title: string;

    @IsOptional()
    @IsString()
    @ApiProperty({
        required: false,
        enum: ['full_time', 'part_time', 'contract', 'internship', 'volunteer', 'remote', 'freelance'],
        description: 'This is a optional property',
        default: "full_time",
    })
    employment_type: string;

    @IsOptional()
    @IsString()
    @ApiProperty({
        type: 'string',
        description: 'This is a optional property',
        default: "Company Name",
    })
    company_name: string;

    @IsOptional()
    @IsString()
    @ApiProperty({
        type: 'string',
        description: 'This is a optional property',
        default: "Location",
    })
    location: string;

    @IsOptional()
    @IsString()
    @ApiProperty({
        type: 'string',
        description: 'This is a optional property',
        default: "Onsite",
    })
    location_type: string;

    @MaxLength(255, {
        message: 'Description is too long (255 characters max)',
    })
    @IsOptional()
    @IsString()
    @ApiProperty({
        type: 'string',
        description: 'This is a optional property',
        default: "Description",
    })
    description: string;

    @IsString()
    @ApiProperty({
        type: 'string',
        description: 'This is a required property',
        default: "2021-09",
    })
    start_date: string;

    @IsString()
    @ApiProperty({
        type: 'string',
        description: 'This is a required property',
        default: "2025-09",
    })
    end_date: string;
}
