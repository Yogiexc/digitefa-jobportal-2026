import { Module } from '@nestjs/common';
import { AdminsService } from './admins.service';
import { AdminsController } from './admins.controller';
import { PrismaModule } from 'prisma/prisma.module';
import { LogActivityModule } from 'src/log-activity/log-activity.module';

@Module({
  imports: [PrismaModule, LogActivityModule],
  controllers: [AdminsController],
  providers: [AdminsService],
})
export class AdminsModule { }
