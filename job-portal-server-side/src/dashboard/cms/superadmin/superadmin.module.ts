import { Module } from '@nestjs/common';
import { SuperadminService } from './superadmin.service';
import { SuperadminController } from './superadmin.controller';
import { PrismaModule } from 'prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [SuperadminController],
  providers: [SuperadminService],
})
export class SuperadminModule { }
