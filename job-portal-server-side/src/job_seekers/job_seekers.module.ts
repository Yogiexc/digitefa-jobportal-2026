import { Module } from '@nestjs/common';
import { JobSeekersService } from './job_seekers.service';
import { JobSeekersController } from './job_seekers.controller';
import { PrismaModule } from 'prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [JobSeekersController],
  providers: [JobSeekersService],
})
export class JobSeekersModule { }
