import { ApiProperty } from "@nestjs/swagger";
import { IsEnum, IsOptional, IsString } from "class-validator";

export class ChangeStatusApplicationsDto {
@IsEnum(['screening', 'waiting_interview', 'interviewing', 'accepted', 'rejected'])
@ApiProperty({
    enum: ['screening', 'waiting_interview', 'interviewing', 'accepted', 'rejected'],
    description: 'Status update for application',
    default: 'screening',
})
status: "screening" | "waiting_interview" | "interviewing" | "accepted" | "rejected";
    @IsOptional()
    @IsString()
    @ApiProperty({ required: false, description: 'Interview date if status is interviewing' })
    interview_date?: string;

    @IsOptional()
    @IsString()
    @ApiProperty({ required: false, description: 'Meeting link if status is interviewing' })
    meeting_link?: string;

    @IsOptional()
    @IsString()
    @ApiProperty({ required: false, description: 'Notes if status is interviewing' })
    notes?: string;
}
