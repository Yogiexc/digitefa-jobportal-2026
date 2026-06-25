import { ApiProperty } from "@nestjs/swagger";
import { IsEnum, IsOptional, IsString } from "class-validator";

export class ChangeStatusCompanyDto {

    @IsString()
    @ApiProperty({
        type: String,
        description: 'This is a required property',
        default: 'ID Company',
    })
    company_id: string;

    @IsEnum(['accepted', 'rejected'])
    @ApiProperty({
        enum: ['accepted', 'rejected'],
        description: 'This is a required property',
        default: 'accepted',
    })
    status: "accepted" | "rejected";

    @IsString()
    @IsOptional()
    @ApiProperty({
        type: String,
        description: 'This is a required property',
        default: 'selamat, perusahaan anda telah diterima',
    })
    notes: string;
}
