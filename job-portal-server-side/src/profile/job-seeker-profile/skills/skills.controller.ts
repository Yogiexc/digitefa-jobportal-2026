import { Body, Controller, Delete, Get, Param, Post, Request, UseGuards } from '@nestjs/common';
import { SkillsService } from './skills.service';
import { CreateSkillDto } from './dto/create-skill.dto';
import { ApiBearerAuth, ApiConsumes, ApiOperation, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';

@ApiTags('job-seeker-profile-skills')
@Controller('profile/job-seeker')
export class SkillsController {
  constructor(private readonly skillsService: SkillsService) { }

  @Get('skills')
  @ApiBearerAuth('access-token')
  @UseGuards(new JwtAuthGuard(['job_seeker']))
  @ApiOperation({ summary: 'Get job seeker skills' })
  async getSkills(@Request() req) {
    return this.skillsService.getSkills(req.user);
  }

  @Post('skills')
  @ApiConsumes('application/json')
  @ApiBearerAuth('access-token')
  @UseGuards(new JwtAuthGuard(['job_seeker']))
  @ApiOperation({ summary: 'Add a new skill', description: 'Adds a new skill to the profile. Case-insensitive duplicate check applies.' })
  async updateSkills(@Request() req, @Body() updateSkillsDto: CreateSkillDto) {
    return this.skillsService.createSkills(req.user, updateSkillsDto);
  }

  @Delete('skills/:skill_id')
  @ApiBearerAuth('access-token')
  @UseGuards(new JwtAuthGuard(['job_seeker']))
  @ApiOperation({ summary: 'Delete a job seeker skill' })
  async deleteSkill(@Request() req, @Param('skill_id') skill_id: string) {
    return this.skillsService.deleteSkill(req.user, skill_id);
  }


}
