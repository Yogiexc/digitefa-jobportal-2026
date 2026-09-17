import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsString, MinLength } from "class-validator";

export class RegisterJobSeekerDto {
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
    @MinLength(8)
    @ApiProperty({
        type: String,
        description: 'This is a required property',
        default: 'jobseeker',
    })
    password: string;
}
