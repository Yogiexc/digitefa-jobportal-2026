import { Module } from '@nestjs/common';
import { CompanyProfileService } from './company-profile.service';
import { CompanyProfileController } from './company-profile.controller';
import { PrismaModule } from 'prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [CompanyProfileController],
  providers: [CompanyProfileService],
})
export class CompanyProfileModule {}
