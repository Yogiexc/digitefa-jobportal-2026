import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsString } from "class-validator";

export class CreateCompanyDto {

    @IsEmail()
    @ApiProperty({
        type: String,
        description: 'This is a required property',
        default: 'company@mail.com',
    })
    email: string;

    @IsString()
    @ApiProperty({
        type: String,
        description: 'This is a required property',
        default: 'company',
    })
    password: string;
}
