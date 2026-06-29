import { ApiProperty } from "@nestjs/swagger";
import { IsArray, IsEnum, IsInt, IsOptional, IsString } from "class-validator";
import { JobCategory } from "./job-category.enum";

export class CreateJobDto {
    @IsString()
    @ApiProperty({
        type: String,
        description: 'This is a required property',
        default: 'Job Title',
    })
    title: string;

    @IsEnum(JobCategory)
    @ApiProperty({
        enum: JobCategory,
        description: 'This is a required property',
        default: JobCategory.information_and_communication_technology,
    })
    category: JobCategory;

    @IsEnum(['full_time', 'freelance', 'internship'])
    @ApiProperty({
        enum: ['full_time', 'freelance', 'internship'],
        description: 'This is a required property',
        default: 'full_time',
    })
    employment_type: "full_time" | "freelance" | "internship";

    @IsEnum(['on_site', 'remote', 'hybrid'])
    @ApiProperty({
        enum: ['on_site', 'remote', 'hybrid'],
        description: 'This is a required property',
        default: 'on_site',
    })
    work_type: "on_site" | "remote" | "hybrid";

    @IsString()
    @ApiProperty({
        type: String,
        description: 'This is a required property',
        default: 'Job Description',
    })
    description: string;

    @IsString()
    @ApiProperty({
        type: String,
        description: 'This is a required property',
        default: 'Location',
    })
    location: string;

    @IsEnum(['monthly_based', 'project_based'])
    @ApiProperty({
        enum: ['monthly_based', 'project_based'],
        description: 'This is a required property',
        default: 'monthly_based',
    })
    salary_type: 'monthly_based' | 'project_based';

    @IsInt()
    @ApiProperty({
        type: Number,
        description: 'This is a required property',
        default: 500000,
    })
    minimum_salary: number;

    @IsInt()
    @ApiProperty({
        type: Number,
        description: 'This is a required property',
        default: 1000000,
    })
    maximum_salary: number;

    @IsEnum([true, false])
    @ApiProperty({
        enum: [true, false],
        description: 'This is a required property',
        default: 'true',
    })
    hide_salary: string;

    @IsString()
    @ApiProperty({
        type: String,
        description: 'This is a required property',
        default: 'Education Requirement',
    })
    education_requirement: string;

    @IsString()
    @ApiProperty({
        type: String,
        description: 'This is a required property',
        default: 'Experience Requirement',
    })
    experience_requirement: string;

    @IsString()
    @ApiProperty({
        type: String,
        description: 'This is a required property',
        default: 'Skills Category',
    })
    skills_category: string;

    @IsArray()
    @ApiProperty({
        type: String,
        description: 'This is a required property',
        default: ['Skills1', 'Skills2', 'Skills3', 'Skills4'],
    })
    skills_requirement: Array<string>;

    @IsOptional()
    @IsArray()
    @ApiProperty({
        type: String,
        description: 'This is an optional property',
        default: ['Benefits1', 'Benefits2', 'Benefits3', 'Benefits4'],
    })
    benefits?: Array<string>;

    @IsEnum(['active', 'draft'])
    @ApiProperty({
        enum: ['active', 'draft'],
        description: 'This is a required property',
        default: 'active',
    })
    status: 'active' | 'draft';

    @ApiProperty({
        type: String,
        description: 'Optional expired date',
        required: false,
    })
    expired_at?: string;
}
