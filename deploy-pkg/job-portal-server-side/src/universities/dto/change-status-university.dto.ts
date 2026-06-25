import { ApiProperty } from "@nestjs/swagger";
import { IsOptional, IsString } from "class-validator";

export class ChangeStatusUniversityDto {

    @IsString()
    @ApiProperty({
        type: String,
        description: 'This is a required property',
        default: 'ID University',
    })
    university_id: string;

    @IsString()
    @ApiProperty({
        type: String,
        description: 'This is a required property',
        default: 'accepted',
    })
    status: "accepted" | "rejected";

    @IsString()
    @IsOptional()
    @ApiProperty({
        type: String,
        description: 'This is a required property',
        default: 'mohon maaf, anda belum mengupload logo universitas',
    })
    notes: string;
}
