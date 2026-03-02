import { ApiProperty } from "@nestjs/swagger";
import { IsString } from "class-validator";

export class CreateExperienceLevelDto {
    @IsString()
    @ApiProperty({
        type: String,
        description: 'This is a required property',
        default: 'Experience Name',
    })
    name: string;
}
