import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsString } from "class-validator";

export class LoginJobSeekerDto {
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
