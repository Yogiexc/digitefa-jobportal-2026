import { Module } from '@nestjs/common';
import { LmsService } from './lms.service';
import { LmsController } from './lms.controller';
import { PrismaModule } from 'prisma/prisma.module';
import { HttpModule } from '@nestjs/axios';

@Module({
  imports: [PrismaModule, HttpModule],
  controllers: [LmsController],
  providers: [LmsService],
})
export class LmsModule {}
