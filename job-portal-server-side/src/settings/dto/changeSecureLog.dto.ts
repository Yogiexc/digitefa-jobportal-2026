import { ApiProperty } from "@nestjs/swagger";
import { IsString } from "class-validator";

export class ChangeSecureLog {
    @IsString()
    @ApiProperty({
        enum: ['true', 'false'],
        description: 'This is a required property',
        default: 'true',
    })
    status: string;

    @IsString()
    @ApiProperty({
        description: 'This is a required property',
        default: '10',
    })
    interval: string;
}
