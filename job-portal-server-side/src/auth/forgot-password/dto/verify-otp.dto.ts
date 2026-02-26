import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsString } from "class-validator";

export class VerifyOTPDto {
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
    })
    otp: string;
}
