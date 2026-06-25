import { Controller, Get, Post, Body, Param, Delete, UseGuards, Request, Put } from '@nestjs/common';
import { ExperienceService } from './experience.service';
import { CreateExperienceDto } from './dto/create-experience.dto';
import { UpdateExperienceDto } from './dto/update-experience.dto';
import { ApiBearerAuth, ApiConsumes, ApiOperation, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';

@ApiTags('job-seeker-profile-experience')
@Controller('profile/job-seeker/experience')
export class ExperienceController {
  constructor(private readonly experienceService: ExperienceService) { }

  @Get()
  @ApiBearerAuth('access-token')
  @UseGuards(new JwtAuthGuard(['job_seeker']))
  @ApiOperation({ summary: 'Get all experience job seeker' })
  getExperiences(@Request() req) {
    return this.experienceService.getExperiences(req.user);
  }

  @Get('/:experience_id')
  @ApiBearerAuth('access-token')
  @UseGuards(new JwtAuthGuard(['job_seeker']))
  @ApiOperation({ summary: 'Get experience job seeker' })
  getExperience(@Param('experience_id') experience_id: string, @Request() req) {
    return this.experienceService.getExperience(req.user, experience_id);
  }

  @Post()
  @ApiConsumes('multipart/form-data')
  @ApiConsumes('application/json')
  @ApiBearerAuth('access-token')
  @UseGuards(new JwtAuthGuard(['job_seeker']))
  @ApiOperation({ summary: 'Add experience job seeker' })
  addExperience(@Request() req, @Body() createExperienceDto: CreateExperienceDto) {
    return this.experienceService.addExperience(req.user, createExperienceDto);
  }

  @Put('/:experience_id')
  @ApiConsumes('multipart/form-data')
  @ApiConsumes('application/json')
  @ApiBearerAuth('access-token')
  @UseGuards(new JwtAuthGuard(['job_seeker']))
  @ApiOperation({ summary: 'Update experience job seeker' })
  updateExperience(@Param('experience_id') experience_id: string, @Request() req, @Body() updateExperienceDto: UpdateExperienceDto) {
    return this.experienceService.updateExperience(req.user, experience_id, updateExperienceDto);
  }

  @Delete('/:experience_id')
  @ApiBearerAuth('access-token')
  @UseGuards(new JwtAuthGuard(['job_seeker']))
  @ApiOperation({ summary: 'Delete experience job seeker' })
  deleteExperience(@Param('experience_id') experience_id: string, @Request() req) {
    return this.experienceService.deleteExperience(req.user, experience_id);
  }
}
