import { ApiProperty } from "@nestjs/swagger";
import { IsEnum, IsOptional, IsString } from "class-validator";

export class ChangeStatusApplicationsDto {
    @IsEnum(['waiting_interview', 'accepted', 'rejected'])
    @ApiProperty({
        enum: ['waiting_interview', 'accepted', 'rejected'],
        description: 'Status update for application',
        default: 'waiting_interview',
    })
    status: "waiting_interview" | "accepted" | "rejected";
    @IsOptional()
    @IsString()
    @ApiProperty({ required: false, description: 'Interview date if status is waiting_interview' })
    interview_date?: string;

    @IsOptional()
    @IsString()
    @ApiProperty({ required: false, description: 'Meeting link if status is waiting_interview' })
    meeting_link?: string;

    @IsOptional()
    @IsString()
    @ApiProperty({ required: false, description: 'Notes if status is waiting_interview' })
    notes?: string;
}
