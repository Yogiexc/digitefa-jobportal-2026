import { ApiProperty } from "@nestjs/swagger";
import { IsString } from "class-validator";

export class CreateLanguageDto {
    @IsString()
    @ApiProperty({
        type: 'string',
        description: 'This is a required property',
        default: "Bahasa Indonesia",
    })
    language_name: string;
}
