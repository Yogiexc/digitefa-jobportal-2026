import { Controller, Get, Param, Query, UseGuards } from '@nestjs/common';
import { JobSeekersService } from './job_seekers.service';
import { ApiBearerAuth, ApiOperation, ApiQuery, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';

@ApiTags('job-seekers')
@Controller('job-seekers')
export class JobSeekersController {
  constructor(private readonly jobSeekersService: JobSeekersService) { }

  // @Post()
  // @ApiOperation({ summary: 'Create a job seeker' })
  // create(@Body() createJobSeekerDto: CreateJobSeekerDto) {
  //   return this.jobSeekersService.create(createJobSeekerDto);
  // }

  @Get('management')
  @ApiBearerAuth('access-token')
  @UseGuards(new JwtAuthGuard(['superadmin']))
  @ApiOperation({ summary: 'List all job seekers (Talent Management)' })
  @ApiQuery({ name: 'page', required: false, type: Number, example: 1, description: 'Page number' })
  @ApiQuery({ name: 'pageSize', required: false, type: Number, example: 10, description: 'Number of items per page' })
  @ApiQuery({ name: 'search', required: false, type: String, example: '', description: 'Search term' })
  @ApiQuery({ name: 'sortBy', required: false, type: String, example: '', description: 'Field to sort by' })
  @ApiQuery({ name: 'sortOrder', required: false, enum: ['asc', 'desc'], example: '', description: 'Sort order' })
  findAllTalents(
    @Query('page') page?: number,
    @Query('pageSize') pageSize?: number,
    @Query('search') search?: string,
    @Query('sortBy') sortBy?: string,
    @Query('sortOrder') sortOrder?: 'asc' | 'desc'
  ) {
    return this.jobSeekersService.findAllTalents({ page, pageSize, search, sortBy, sortOrder });
  }

  @Get()
  @ApiBearerAuth('access-token')
  @UseGuards(new JwtAuthGuard(['superadmin']))
  @ApiOperation({ summary: 'List all job seekers' })
  @ApiQuery({ name: 'page', required: false, type: Number, example: 1, description: 'Page number' })
  @ApiQuery({ name: 'pageSize', required: false, type: Number, example: 10, description: 'Number of items per page' })
  @ApiQuery({ name: 'search', required: false, type: String, example: '', description: 'Search term' })
  @ApiQuery({ name: 'sortBy', required: false, type: String, example: '', description: 'Field to sort by' })
  @ApiQuery({ name: 'sortOrder', required: false, enum: ['asc', 'desc'], example: '', description: 'Sort order' })
  findAll(
    @Query('page') page?: number,
    @Query('pageSize') pageSize?: number,
    @Query('search') search?: string,
    @Query('sortBy') sortBy?: string,
    @Query('sortOrder') sortOrder?: 'asc' | 'desc'
  ) {
    return this.jobSeekersService.findAll({ page, pageSize, search, sortBy, sortOrder });
  }

  @Get(':job_seeker_id')
  @ApiBearerAuth('access-token')
  @UseGuards(new JwtAuthGuard(['superadmin']))
  @ApiOperation({ summary: 'Get a job seeker details' })
  findOne(@Param('job_seeker_id') job_seeker_id: string) {
    return this.jobSeekersService.findOne(job_seeker_id);
  }

  // @Put(':job_seeker_id')
  // @ApiOperation({ summary: 'Update a job seeker' })
  // update(@Param('job_seeker_id') job_seeker_id: string, @Body() updateJobSeekerDto: UpdateJobSeekerDto) {
  //   return this.jobSeekersService.update(job_seeker_id, updateJobSeekerDto);
  // }

  // @Delete(':job_seeker_id')
  // @ApiOperation({ summary: 'Delete a job seeker' })
  // remove(@Param('job_seeker_id') job_seeker_id: string) {
  //   return this.jobSeekersService.remove(job_seeker_id);
  // }
}
