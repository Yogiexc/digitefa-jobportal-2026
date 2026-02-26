import { PartialType } from '@nestjs/swagger';
import { CreateJobsSearchDto } from './create-jobs-search.dto';

export class UpdateJobsSearchDto extends PartialType(CreateJobsSearchDto) {}
