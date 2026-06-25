import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsString } from "class-validator";

export class InviteTalentDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({ example: 'uuid', description: 'Job seeker ID to invite' })
  job_seeker_id: string;
}
