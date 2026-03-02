import { ApiProperty } from "@nestjs/swagger";
import { IsEnum } from "class-validator";

export class ChangeStatusApplicationsDto {
    @IsEnum(['accepted', 'rejected'])
    @ApiProperty({
        enum: ['accepted', 'rejected'],
        description: 'This is a required property',
        default: 'accepted',
    })
    status: "accepted" | "rejected";

}
