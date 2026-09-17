import { PartialType } from '@nestjs/swagger';
import { CreateExperienceLevelDto } from './create-experience-level.dto';

export class UpdateExperienceLevelDto extends PartialType(CreateExperienceLevelDto) {}
