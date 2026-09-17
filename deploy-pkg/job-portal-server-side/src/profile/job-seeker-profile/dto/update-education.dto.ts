import { ApiProperty } from "@nestjs/swagger";
import { IsOptional, IsString } from "class-validator";

export class UpdateEducationDto {
    @IsString()
    @ApiProperty({
        type: 'string',
        description: 'University name',
        default: `Universitas Sebelas Maret`,
    })
    university_name: string;

    @IsString()
    @ApiProperty({
        type: 'string',
        description: 'Education degree',
        default: `Bachelor's Degree`,
    })
    degree: string;

    @IsString()
    @ApiProperty({
        type: 'string',
        description: 'Major',
        default: 'Computer Science',
    })
    major: string;

    @IsString()
    @ApiProperty({
        type: 'string',
        description: 'Start date',
        default: '2017-09',
    })
    start_date: string;

    @IsOptional()
    @IsString()
    @ApiProperty({
        required: false,
        type: 'string',
        description: 'End date',
        default: '2021-09',
    })
    end_date: string;

    @IsOptional()
    @IsString()
    @ApiProperty({
        required: false,
        type: 'string',
        description: 'Grade',
        default: '3.5',
    })
    grade: string;
}
