import { Module } from '@nestjs/common';
import { JobsSearchService } from './jobs-search.service';
import { JobsSearchController } from './jobs-search.controller';
import { PrismaModule } from '../../prisma/prisma.module';
import { HttpModule } from '@nestjs/axios';

@Module({
  imports: [PrismaModule, HttpModule.register({
    timeout: 5000,
    maxRedirects: 5,
  })],
  controllers: [JobsSearchController],
  providers: [JobsSearchService],
})
export class JobsSearchModule { }
