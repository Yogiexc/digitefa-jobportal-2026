import { ApiProperty } from "@nestjs/swagger";
import { IsString } from "class-validator";

export class ChangeEmailDto {
    @IsString()
    @ApiProperty({
        type: String,
        description: 'This is a required property',
        default: 'jobseekernew@mail.com',
    })
    newEmail: string;

    @IsString()
    @ApiProperty({
        type: String,
        description: 'This is a required property',
        default: 'jobseekernew',
    })
    password: string;
}
