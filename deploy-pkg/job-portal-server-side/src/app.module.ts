import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from '../prisma/prisma.module';
import { JobSeekersModule } from './job_seekers/job_seekers.module';
import { AuthModule } from './auth/auth.module';
import { LoginModule } from './auth/login/login.module';
import { CompaniesModule } from './companies/companies.module';
import { ConfigModule } from '@nestjs/config';
import { CompanyProfileModule } from './profile/company-profile/company-profile.module';
import { JobSeekerProfileModule } from './profile/job-seeker-profile/job-seeker-profile.module';
import { UniversityProfileModule } from './profile/university-profile/university-profile.module';
import { UniversitiesModule } from './universities/universities.module';
import { PositionLevelsModule } from './master-data/position-levels/position-levels.module';
import { AdminsModule } from './admins/admins.module';
import { JobsModule } from './jobs/jobs.module';
import { ApplicantsModule } from './applicants/applicants.module';
import { ProfileModule } from './profile/profile.module';
import { SkillsCategoryModule } from './master-data/skills-category/skills-category.module';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { LogActivityModule } from './log-activity/log-activity.module';
import { StudentModule } from './student/student.module';
import { JobsSearchModule } from './jobs-search/jobs-search.module';
import { ContentModule } from './content/content.module';
import { DashboardModule } from './dashboard/dashboard.module';
import { ExperienceLevelsModule } from './master-data/experience-levels/experience-levels.module';
import { SettingsModule } from './settings/settings.module';
import { V3Module } from './v3/v3.module';
import { LmsModule } from './lms/lms.module';

@Module({
  imports: [
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', '..', 'public'),
      serveRoot: '/public',
      serveStaticOptions: { index: false },
    }), ConfigModule.forRoot({
      envFilePath: process.env.NODE_ENV ? `.env.${process.env.NODE_ENV}` : '.env',
      isGlobal: true,
    }), PrismaModule, AuthModule, LoginModule, AdminsModule, JobSeekersModule, CompaniesModule, UniversitiesModule, ProfileModule, CompanyProfileModule, JobSeekerProfileModule, UniversityProfileModule, PositionLevelsModule, JobsModule, ApplicantsModule, SkillsCategoryModule, LogActivityModule, StudentModule, JobsSearchModule, ContentModule, DashboardModule, ExperienceLevelsModule, SettingsModule, V3Module, LmsModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
