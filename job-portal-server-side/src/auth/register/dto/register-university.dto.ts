import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsString, MinLength } from "class-validator";

export class RegisterUniversityDto {
    @IsString()
    @ApiProperty({
        type: String,
        description: 'This is a required property',
        default: 'University',
    })
    university_name: string;

    @IsString()
    @ApiProperty({
        type: String,
        description: 'This is a required property',
        default: 'University',
    })
    full_name: string;

    @IsEmail()
    @ApiProperty({
        type: String,
        description: 'This is a required property',
        default: 'university@mail.com',
    })
    email: string;

    @IsString()
    @MinLength(6)
    @ApiProperty({
        type: String,
        description: 'This is a required property',
        default: 'university',
    })
    password: string;
}
