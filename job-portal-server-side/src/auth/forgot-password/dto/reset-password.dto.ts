import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsString, MinLength } from "class-validator";

export class ResetPasswordDto {
    @IsEmail()
    @ApiProperty({
        type: String,
        description: 'This is a required property',
        default: 'jobseeker@mail.com',
    })
    email: string;

    @IsString()
    @MinLength(4)
    @ApiProperty({
        type: String,
        description: 'This is a required property',
        default: '1234',
    })
    otp: string;

    @IsString()
    @MinLength(6)
    @ApiProperty({
        type: String,
        description: 'This is a required property',
        default: 'newjobseeker',
    })
    newPassword: string;
}
