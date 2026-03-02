import { PartialType } from '@nestjs/swagger';
import { CreateJobSeekerDto } from './create-job_seeker.dto';

export class UpdateJobSeekerDto extends PartialType(CreateJobSeekerDto) {}
