import { IsIn, IsOptional, IsString } from 'class-validator';

export class FindAllAppliedJobsForLmsDto {
  @IsOptional()
  @IsString()
  search?: string;

  @IsOptional()
  @IsString()
  sortBy?: string;

  @IsOptional()
  @IsIn(['asc', 'desc'])
  sortOrder?: 'asc' | 'desc';

  @IsOptional()
  @IsString()
  status?: string;
}
