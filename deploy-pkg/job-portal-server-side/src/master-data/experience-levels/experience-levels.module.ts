import { Module } from '@nestjs/common';
import { ExperienceLevelsService } from './experience-levels.service';
import { ExperienceLevelsController } from './experience-levels.controller';
import { PrismaModule } from '../../../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [ExperienceLevelsController],
  providers: [ExperienceLevelsService],
})
export class ExperienceLevelsModule { }
