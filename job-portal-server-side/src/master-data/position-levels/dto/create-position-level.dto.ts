import { ApiProperty } from "@nestjs/swagger";
import { IsString } from "class-validator";

export class CreatePositionLevelDto {
    @IsString()
    @ApiProperty({
        type: String,
        description: 'This is a required property',
        default: 'Position Name',
    })
    position_name: string;
}
