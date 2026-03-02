import { ApiProperty } from "@nestjs/swagger";
import { IsString } from "class-validator";

export class ChangePasswordDto {
    @IsString()
    @ApiProperty({
        type: String,
        description: 'This is a required property',
        default: 'jobseeker',
    })
    oldPassword: string;

    @IsString()
    @ApiProperty({
        type: String,
        description: 'This is a required property',
        default: 'jobseekerNew',
    })
    newPassword: string;
}
