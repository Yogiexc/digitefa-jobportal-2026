import { Module } from '@nestjs/common';
import { SkillsCategoryService } from './skills-category.service';
import { SkillsCategoryController } from './skills-category.controller';
import { PrismaModule } from 'prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [SkillsCategoryController],
  providers: [SkillsCategoryService],
})
export class SkillsCategoryModule {}
