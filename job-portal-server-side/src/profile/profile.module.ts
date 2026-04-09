import { Module } from '@nestjs/common';
import { ProfileService } from './profile.service';
import { ProfileController } from './profile.controller';
import { PrismaModule } from '../../prisma/prisma.module';
import { JobSeekerProfileModule } from './job-seeker-profile/job-seeker-profile.module';
import { CompanyProfileModule } from './company-profile/company-profile.module';
import { UniversityProfileModule } from './university-profile/university-profile.module';

@Module({
  imports: [
    PrismaModule,
    JobSeekerProfileModule,
    CompanyProfileModule,
    UniversityProfileModule
  ],
  controllers: [ProfileController],
  providers: [ProfileService],
})
export class ProfileModule { }
