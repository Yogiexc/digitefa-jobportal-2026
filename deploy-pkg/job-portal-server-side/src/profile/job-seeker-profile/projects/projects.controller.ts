import { Controller, Get, Post, Body, Param, Delete, UseGuards, Request, Put } from '@nestjs/common';
import { ProjectsService } from './projects.service';
import { ApiBearerAuth, ApiConsumes, ApiOperation, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { CreateProjectDto } from './dto/create-project.dto';

@ApiTags('job-seeker-profile-projects')
@Controller('profile/job-seeker/projects')
export class ProjectsController {
  constructor(private readonly projectsService: ProjectsService) {}

  @Get()
  @ApiBearerAuth('access-token')
  @UseGuards(new JwtAuthGuard(['job_seeker']))
  @ApiOperation({ summary: 'Get all projects job seeker' })
  getProjects(@Request() req) {
    return this.projectsService.getProjects(req.user);
  }

  @Get('/:project_id')
  @ApiBearerAuth('access-token')
  @UseGuards(new JwtAuthGuard(['job_seeker']))
  @ApiOperation({ summary: 'Get project job seeker' })
  getProject(@Param('project_id') project_id: string, @Request() req) {
    return this.projectsService.getProject(req.user, project_id);
  }

  @Post()
  @ApiConsumes('multipart/form-data')
  @ApiConsumes('application/json')
  @ApiBearerAuth('access-token')
  @UseGuards(new JwtAuthGuard(['job_seeker']))
  @ApiOperation({ summary: 'Add projects job seeker' })
  addProjects(@Request() req, @Body() createProjectDto: CreateProjectDto) {
    return this.projectsService.addProjects(req.user, createProjectDto);
  }

  @Put('/:project_id')
  @ApiConsumes('multipart/form-data')
  @ApiConsumes('application/json')
  @ApiBearerAuth('access-token')
  @UseGuards(new JwtAuthGuard(['job_seeker']))
  @ApiOperation({ summary: 'Update projects job seeker' })
  updateProjects(@Param('project_id') project_id: string, @Request() req, @Body() createProjectDto: CreateProjectDto) {
    return this.projectsService.updateProjects(req.user, project_id, createProjectDto);
  }

  @Delete('/:project_id')
  @ApiBearerAuth('access-token')
  @UseGuards(new JwtAuthGuard(['job_seeker']))
  @ApiOperation({ summary: 'Delete projects job seeker' })
  deleteProjects(@Param('project_id') project_id: string, @Request() req) {
    return this.projectsService.deleteProjects(req.user, project_id);
  }
}
