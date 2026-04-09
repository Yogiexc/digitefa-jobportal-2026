import { Module } from '@nestjs/common';
import { JobSeekerProfileService } from './job-seeker-profile.service';
import { JobSeekerProfileController } from './job-seeker-profile.controller';
import { PrismaModule } from '../../../prisma/prisma.module';
import { CertificationsModule } from './certifications/certifications.module';
import { ProjectsModule } from './projects/projects.module';
import { ExperienceModule } from './experience/experience.module';
import { LanguagesModule } from './languages/languages.module';
import { SkillsModule } from './skills/skills.module';

@Module({
  imports: [PrismaModule, CertificationsModule, ProjectsModule, ExperienceModule, LanguagesModule, SkillsModule],
  controllers: [JobSeekerProfileController],
  providers: [JobSeekerProfileService],
})
export class JobSeekerProfileModule { }
