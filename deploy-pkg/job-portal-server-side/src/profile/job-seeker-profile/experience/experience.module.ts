import { Module } from '@nestjs/common';
import { ExperienceService } from './experience.service';
import { ExperienceController } from './experience.controller';
import { PrismaModule } from '../../../../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [ExperienceController],
  providers: [ExperienceService],
})
export class ExperienceModule { }
