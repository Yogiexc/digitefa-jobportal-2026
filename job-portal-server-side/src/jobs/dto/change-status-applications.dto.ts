import { ApiProperty } from "@nestjs/swagger";
import { IsEnum } from "class-validator";

export class ChangeStatusApplicationsDto {
    @IsEnum(['accepted', 'rejected', 'waiting_interview'])
    @ApiProperty({
        enum: ['accepted', 'rejected', 'waiting_interview'],
        description: 'This is a required property',
        default: 'accepted',
    })
    status: "accepted" | "rejected" | "waiting_interview";

}
