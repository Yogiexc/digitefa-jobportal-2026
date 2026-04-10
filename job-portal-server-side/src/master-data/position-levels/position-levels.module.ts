import { Module } from '@nestjs/common';
import { PositionLevelsService } from './position-levels.service';
import { PositionLevelsController } from './position-levels.controller';
import { PrismaModule } from '../../../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [PositionLevelsController],
  providers: [PositionLevelsService],
})
export class PositionLevelsModule { }
