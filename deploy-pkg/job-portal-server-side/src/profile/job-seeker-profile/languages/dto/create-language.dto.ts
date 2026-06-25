import { ApiProperty } from "@nestjs/swagger";
import { IsString } from "class-validator";

export class CreateLanguageDto {
    @IsString()
    @ApiProperty({
        type: 'string',
        description: 'The name of the language. Must be unique (case-insensitive) for the user.',
        default: "Bahasa Indonesia",
    })
    language_name: string;
}
