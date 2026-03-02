import { Module } from '@nestjs/common';
import { DashboardService } from './dashboard.service';
import { DashboardController } from './dashboard.controller';
import { PrismaModule } from 'prisma/prisma.module';
import { SuperadminModule } from './cms/superadmin/superadmin.module';
import { CompanyModule } from './cms/company/company.module';
import { UniversityModule } from './cms/university/university.module';

@Module({
  imports: [PrismaModule, SuperadminModule, CompanyModule, UniversityModule],
  controllers: [DashboardController],
  providers: [DashboardService],
})
export class DashboardModule { }
