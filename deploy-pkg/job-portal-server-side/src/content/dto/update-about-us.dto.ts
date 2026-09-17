import { ApiProperty } from "@nestjs/swagger";
import { IsString } from "class-validator";

export class UpdateAboutUsDto {
    @IsString()
    @ApiProperty({
        type: String,
        description: 'This is a required property',
        default: 'Content of the about us page',
    })
    content: string;
}
