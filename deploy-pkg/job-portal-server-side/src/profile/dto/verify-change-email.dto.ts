import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsString, Length } from "class-validator";

export class VerifyChangeEmailDto {
    @IsEmail()
    @ApiProperty({
        type: String,
        description: 'This is a required property',
        default: 'jobseekernew@mail.com',
    })
    newEmail: string;

    @IsString()
    @Length(4)
    @ApiProperty({
        type: String,
        description: 'This is a required property',
    })
    otp: string;
}
