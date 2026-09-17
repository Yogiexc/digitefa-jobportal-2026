import { PartialType } from '@nestjs/swagger';
import { CreateUniversityProfileDto } from './create-university-profile.dto';

export class UpdateUniversityProfileDto extends PartialType(CreateUniversityProfileDto) {}
