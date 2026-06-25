import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsString } from "class-validator";

export class CreateUniversityDto {

    @IsEmail()
    @ApiProperty({
        type: String,
        description: 'This is a required property',
        default: 'university@mail.com',
    })
    email: string;

    @IsString()
    @ApiProperty({
        type: String,
        description: 'This is a required property',
        default: 'university',
    })
    password: string;
}
