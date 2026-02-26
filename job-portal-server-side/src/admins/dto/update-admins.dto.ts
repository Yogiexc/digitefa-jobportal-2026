import { PartialType } from '@nestjs/swagger';
import { CreateAdminDto } from './create-admins.dto';

export class UpdateAdminDto extends PartialType(CreateAdminDto) {}
