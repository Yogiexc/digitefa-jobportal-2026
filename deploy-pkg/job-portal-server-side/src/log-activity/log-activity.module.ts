import { Module } from '@nestjs/common';
import { LogActivityService } from './log-activity.service';
import { LogActivityController } from './log-activity.controller';
import { PrismaModule } from '../../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  exports: [LogActivityService],
  controllers: [LogActivityController],
  providers: [LogActivityService],
})
export class LogActivityModule { }
