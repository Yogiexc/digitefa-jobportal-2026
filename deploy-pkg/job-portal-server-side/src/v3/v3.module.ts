import { Module } from '@nestjs/common';
import { V3Service } from './v3.service';
import { V3Controller } from './v3.controller';
import { PrismaModule } from '../../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [V3Controller],
  providers: [V3Service],
})
export class V3Module { }
