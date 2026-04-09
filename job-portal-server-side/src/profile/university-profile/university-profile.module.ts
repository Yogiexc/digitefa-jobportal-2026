import { Module } from '@nestjs/common';
import { UniversityProfileService } from './university-profile.service';
import { UniversityProfileController } from './university-profile.controller';
import { PrismaModule } from '../../../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [UniversityProfileController],
  providers: [UniversityProfileService],
})
export class UniversityProfileModule { }
