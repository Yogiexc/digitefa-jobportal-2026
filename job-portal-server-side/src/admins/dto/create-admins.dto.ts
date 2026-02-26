import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsString } from "class-validator";

export class CreateAdminDto {

    @IsEmail()
    @ApiProperty({
        type: String,
        description: 'This is a required property',
        default: 'admin@mail.com',
    })
    email: string;

    @IsString()
    @ApiProperty({
        type: String,
        description: 'This is a required property',
        default: 'admin',
    })
    full_name: string;

    @IsString()
    @ApiProperty({
        type: String,
        description: 'This is a required property',
        default: 'admin',
    })
    password: string;
}
