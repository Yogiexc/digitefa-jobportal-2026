import { IsNotEmpty, IsUUID } from 'class-validator';

export class UnlinkJobPortalAccountDto {
  @IsUUID()
  @IsNotEmpty()
  job_seeker_id: string;
}
