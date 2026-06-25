import { ApiProperty } from "@nestjs/swagger";
import { IsString, MaxLength } from "class-validator";

export class CreateProjectDto {
    @IsString()
    @ApiProperty({
        type: 'string',
        description: 'This is a required property',
        default: "Project Name",
    })
    project_name: string;

    @IsString()
    @MaxLength(255, {
        message: 'Description is too long (255 characters max)',
    }
    )
    @ApiProperty({
        type: 'string',
        description: 'This is a required property',
        default: "Project Description",
    })
    description: string;

    @IsString()
    @ApiProperty({
        type: 'string',
        description: 'This is a required property',
        default: '2021-09',
    })
    start_date: string;

    @IsString()
    @ApiProperty({
        type: 'string',
        description: 'This is a required property',
        default: '2025-09',
    })
    end_date: string;
}
