import { PartialType } from '@nestjs/swagger';
import { CreatePositionLevelDto } from './create-position-level.dto';

export class UpdatePositionLevelDto extends PartialType(CreatePositionLevelDto) {}
