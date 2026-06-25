import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsString, MinLength } from "class-validator";

export class RegisterCompanyDto {
    @IsString()
    @ApiProperty({
        type: String,
        description: 'This is a required property',
        default: 'Company',
    })
    legal_name: string;

    @IsString()
    @ApiProperty({
        type: String,
        description: 'This is a required property',
        default: 'Company',
    })
    full_name: string;

    @IsString()
    @ApiProperty({
        type: String,
        description: 'This is a required property',
        default: '0123456789',
    })
    phone_number: string;

    @IsEmail()
    @ApiProperty({
        type: String,
        description: 'This is a required property',
        default: 'company@mail.com',
    })
    email: string;

    @IsString()
    @MinLength(6)
    @ApiProperty({
        type: String,
        description: 'This is a required property',
        default: 'company',
    })
    password: string;
}
