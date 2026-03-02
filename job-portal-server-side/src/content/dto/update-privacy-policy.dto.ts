import { ApiProperty } from "@nestjs/swagger";
import { IsString } from "class-validator";

export class UpdatePrivacyPolicyDto {
    @IsString()
    @ApiProperty({
        type: String,
        description: 'This is a required property',
        default: 'Content of the privacy policy page',
    })
    content: string;
}
