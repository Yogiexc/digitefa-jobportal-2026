import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsString } from "class-validator";

export class CreateJobSeekerDto {
    @IsString()
    @ApiProperty({
        type: String,
        description: 'This is a required property',
        default: 'Job Seeker',
    })
    full_name: string;

    @IsEmail()
    @ApiProperty({
        type: String,
        description: 'This is a required property',
        default: 'jobseeker@mail.com',
    })
    email: string;

    @IsString()
    @ApiProperty({
        type: String,
        description: 'This is a required property',
        default: 'jobseeker',
    })
    password: string;
}
