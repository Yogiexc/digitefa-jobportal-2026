import { PartialType } from '@nestjs/swagger';
import { CreateV3Dto } from './create-v3.dto';

export class UpdateV3Dto extends PartialType(CreateV3Dto) {}
