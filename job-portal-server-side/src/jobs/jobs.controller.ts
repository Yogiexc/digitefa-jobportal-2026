import { Controller, Get, Post, Body, Param, UseGuards, Request, Query, Put, Delete, Res } from '@nestjs/common';
import { JobsService } from './jobs.service';
import { CreateJobDto } from './dto/create-job.dto';
import { UpdateJobDto } from './dto/update-job.dto';
import { ApiBearerAuth, ApiConsumes, ApiOperation, ApiParam, ApiQuery, ApiTags, ApiHeader } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { ChangeStatusApplicationsDto } from './dto/change-status-applications.dto';
import { ApiKeyGuard } from 'src/auth/guards/api-key.guard';

@Controller()
export class JobsController {
  constructor(private readonly jobsService: JobsService) {}

  @ApiTags('jobs')
  @Post('jobs')
  @ApiConsumes('multipart/form-data')
  @ApiConsumes('application/json')
  @ApiBearerAuth('access-token')
  @UseGuards(new JwtAuthGuard(['company']))
  @ApiOperation({ summary: 'Create a job', description: 'Create a new job' })
  async createJob(@Body() createJobDto: CreateJobDto, @Request() req) {
    return this.jobsService.createJob(createJobDto, req.user);
  }

  @ApiTags('jobs')
  @Get('jobs')
  @ApiBearerAuth('access-token')
  @UseGuards(new JwtAuthGuard(['company']))
  @ApiOperation({ summary: 'List all jobs' })
  @ApiQuery({
    name: 'page',
    required: false,
    type: Number,
    example: 1,
    description: 'Page number',
  })
  @ApiQuery({
    name: 'pageSize',
    required: false,
    type: Number,
    example: 10,
    description: 'Number of items per page',
  })
  @ApiQuery({
    name: 'search',
    required: false,
    type: String,
    example: '',
    description: 'Search term',
  })
  @ApiQuery({
    name: 'sortBy',
    required: false,
    type: String,
    example: '',
    description: 'Field to sort by',
  })
  @ApiQuery({
    name: 'sortOrder',
    required: false,
    enum: ['asc', 'desc'],
    example: 'desc',
    description: 'Sort order',
  })
  @ApiQuery({
    name: 'status',
    required: true,
    enum: ['all', 'active', 'expired', 'draft'],
    example: 'all',
    description: 'Status jobs',
  })
  findAll(
    @Request() req,
    @Query('page') page?: number,
    @Query('pageSize') pageSize?: number,
    @Query('search') search?: string,
    @Query('sortBy') sortBy?: string,
    @Query('sortOrder') sortOrder?: 'asc' | 'desc',
    @Query('status') status?: string,
  ) {
    return this.jobsService.findAll(req.user, {
      page,
      pageSize,
      search,
      sortBy,
      sortOrder,
      status,
    });
  }

  @ApiTags('companies')
  @Get('jobs/company/:company_id')
  @ApiBearerAuth('access-token')
  @UseGuards(new JwtAuthGuard(['superadmin']))
  @ApiOperation({ summary: 'List all jobs in company' })
  @ApiQuery({
    name: 'page',
    required: false,
    type: Number,
    example: 1,
    description: 'Page number',
  })
  @ApiQuery({
    name: 'pageSize',
    required: false,
    type: Number,
    example: 10,
    description: 'Number of items per page',
  })
  @ApiQuery({
    name: 'search',
    required: false,
    type: String,
    example: '',
    description: 'Search term',
  })
  @ApiQuery({
    name: 'sortBy',
    required: false,
    type: String,
    example: '',
    description: 'Field to sort by',
  })
  @ApiQuery({
    name: 'sortOrder',
    required: false,
    enum: ['asc', 'desc'],
    example: 'desc',
    description: 'Sort order',
  })
  @ApiQuery({
    name: 'status',
    required: true,
    enum: ['all', 'active', 'expired', 'draft'],
    example: 'all',
    description: 'Status jobs',
  })
  findAllJobCompany(
    @Request() req,
    @Param('company_id') company_id: string,
    @Query('page') page?: number,
    @Query('pageSize') pageSize?: number,
    @Query('search') search?: string,
    @Query('sortBy') sortBy?: string,
    @Query('sortOrder') sortOrder?: 'asc' | 'desc',
    @Query('status') status?: string,
  ) {
    return this.jobsService.findAllJobCompany(req.user, company_id, {
      page,
      pageSize,
      search,
      sortBy,
      sortOrder,
      status,
    });
  }

  @ApiTags('companies')
  @ApiTags('jobs')
  @Get('jobs/:job_id')
  @ApiBearerAuth('access-token')
  @UseGuards(new JwtAuthGuard(['company', 'superadmin']))
  @ApiOperation({ summary: 'Get detail a job' })
  findOne(@Param('job_id') job_id: string) {
    return this.jobsService.findOne(job_id);
  }

  @ApiTags('jobs')
  @Put('jobs/:job_id')
  @ApiConsumes('multipart/form-data')
  @ApiConsumes('application/json')
  @ApiBearerAuth('access-token')
  @UseGuards(new JwtAuthGuard(['company']))
  @ApiOperation({ summary: 'Update a jobs' })
  update(
    @Param('job_id') job_id: string,
    @Body() updateJobDto: UpdateJobDto,
    @Request() req,
  ) {
    return this.jobsService.update(job_id, updateJobDto, req.user);
  }

  @ApiTags('jobs')
  @Post('jobs/:job_id/reupload')
  @ApiBearerAuth('access-token')
  @UseGuards(new JwtAuthGuard(['company']))
  @ApiOperation({ summary: 'Reupload jobs' })
  reupload(@Param('job_id') job_id: string, @Request() req) {
    return this.jobsService.reupload(job_id, req.user);
  }

  @ApiTags('jobs')
  @Delete('jobs/:job_id')
  @ApiBearerAuth('access-token')
  @UseGuards(new JwtAuthGuard(['company']))
  @ApiOperation({ summary: 'Delete jobs' })
  deleteJob(@Param('job_id') job_id: string, @Request() req) {
    return this.jobsService.deleteJob(job_id, req.user);
  }

  @ApiTags('job-seeker-saved-jobs')
  @Post('jobs/:job_id/save')
  @ApiBearerAuth('access-token')
  @UseGuards(new JwtAuthGuard(['job_seeker']))
  @ApiOperation({ summary: 'Save jobs (by job seeker)' })
  saveJobs(@Param('job_id') job_id: string, @Request() req) {
    return this.jobsService.saveJobs(job_id, req.user);
  }

  @ApiTags('job-seeker-saved-jobs')
  @Post('jobs/:job_id/unsave')
  @ApiBearerAuth('access-token')
  @UseGuards(new JwtAuthGuard(['job_seeker']))
  @ApiOperation({ summary: 'Unsave jobs (by job seeker)' })
  unsaveJobs(@Param('job_id') job_id: string, @Request() req) {
    return this.jobsService.unsaveJobs(job_id, req.user);
  }

  @ApiTags('job-seeker-saved-jobs')
  @Get('saved/jobs')
  @ApiBearerAuth('access-token')
  @UseGuards(new JwtAuthGuard(['job_seeker']))
  @ApiOperation({ summary: 'List all jobs saved by job seeker' })
  @ApiQuery({
    name: 'page',
    required: false,
    type: Number,
    example: 1,
    description: 'Page number',
  })
  @ApiQuery({
    name: 'pageSize',
    required: false,
    type: Number,
    example: 10,
    description: 'Number of items per page',
  })
  @ApiQuery({
    name: 'search',
    required: false,
    type: String,
    example: '',
    description: 'Search term',
  })
  @ApiQuery({
    name: 'sortBy',
    required: false,
    type: String,
    example: '',
    description: 'Field to sort by',
  })
  @ApiQuery({
    name: 'sortOrder',
    required: false,
    enum: ['asc', 'desc'],
    example: 'desc',
    description: 'Sort order',
  })
  findAllJobsSaved(
    @Request() req,
    @Query('page') page?: number,
    @Query('pageSize') pageSize?: number,
    @Query('search') search?: string,
    @Query('sortBy') sortBy?: string,
    @Query('sortOrder') sortOrder?: 'asc' | 'desc',
  ) {
    return this.jobsService.findAllJobsSaved(req.user, {
      page,
      pageSize,
      search,
      sortBy,
      sortOrder,
    });
  }

  @ApiTags('jobs-applicants')
  @Get('jobs/applicants/detail/:application_id')
  @ApiBearerAuth('access-token')
  @UseGuards(new JwtAuthGuard(['company']))
  @ApiOperation({ summary: 'Get detail applicant by application id' })
  async getJobSeekerByApplicationId(
    @Request() req,
    @Param('application_id') application_id: string,
  ) {
    return this.jobsService.getJobSeekerByApplicationId(
      req.user,
      application_id,
    );
  }

  @ApiTags('jobs-applicants')
  @Get('jobs/applicants/:job_id')
  @ApiBearerAuth('access-token')
  @UseGuards(new JwtAuthGuard(['company']))
  @ApiOperation({ summary: 'List all application job vacancy' })
  @ApiQuery({
    name: 'page',
    required: false,
    type: Number,
    example: 1,
    description: 'Page number',
  })
  @ApiQuery({
    name: 'pageSize',
    required: false,
    type: Number,
    example: 10,
    description: 'Number of items per page',
  })
  @ApiQuery({
    name: 'search',
    required: false,
    type: String,
    example: '',
    description: 'Search term',
  })
  @ApiQuery({
    name: 'sortBy',
    required: false,
    type: String,
    example: '',
    description: 'Field to sort by',
  })
  @ApiQuery({
    name: 'sortOrder',
    required: false,
    enum: ['asc', 'desc'],
    example: 'desc',
    description: 'Sort order',
  })
  @ApiQuery({
    name: 'status',
    required: false,
    enum: ['all', 'pending', 'accepted', 'rejected'],
    description: 'Status',
  })
  @ApiQuery({
    name: 'location',
    required: false,
    type: String,
    example: '',
    description: 'Location',
  })
  async findApplicants(
    @Request() req,
    @Param('job_id') job_id: string,
    @Query('page') page?: number,
    @Query('pageSize') pageSize?: number,
    @Query('search') search?: string,
    @Query('sortBy') sortBy?: string,
    @Query('sortOrder') sortOrder?: 'asc' | 'desc',
    @Query('status') status?: string,
    @Query('location') location?: string,
    @Query('startDate') startDate?: string,
    @Query('endDate') endDate?: string,
    @Query('startSalary') startSalary?: number,
    @Query('endSalary') endSalary?: number,
    @Query('startExperience') startExperience?: number,
    @Query('endExperience') endExperience?: number,
  ) {
    return this.jobsService.findApplicants(job_id, req.user, {
      page,
      pageSize,
      search,
      sortBy,
      sortOrder,
      status,
      location,
      startDate,
      endDate,
      startSalary,
      endSalary,
      startExperience,
      endExperience,
    });
  }

  @ApiTags('jobs-applicants')
  @Get('jobs/applicants/resume/:application_id')
  @ApiBearerAuth('access-token')
  @UseGuards(new JwtAuthGuard(['company']))
  @ApiOperation({ summary: 'Get resume appicant by application id' })
  async getResumeApplicants(
    @Request() req,
    @Param('application_id') application_id: string,
  ) {
    return this.jobsService.getResumeApplicants(req.user, application_id);
  }

  @ApiTags('jobs-applicants')
  @Put('jobs/applicants/change-status/:application_id')
  @ApiBearerAuth('access-token')
  @UseGuards(new JwtAuthGuard(['company']))
  @ApiOperation({ summary: 'Change status application' })
  async changeStatusApplicant(
    @Request() req,
    @Param('application_id') application_id: string,
    @Body() changeStatusApplicationsDto: ChangeStatusApplicationsDto,
  ) {
    return this.jobsService.changeStatusApplicant(
      req.user,
      application_id,
      changeStatusApplicationsDto,
    );
  }

  @ApiTags('jobs-applicants')
  @Post('jobs/:job_id/applicants/export')
  @ApiBearerAuth('access-token')
  @UseGuards(new JwtAuthGuard(['company']))
  @ApiParam({
    name: 'job_id',
    required: true,
    type: String,
    description: 'Job ID',
  })
  @ApiQuery({
    name: 'format',
    required: true,
    enum: ['csv', 'xlsx'],
    description: 'Export format',
  })
  @ApiQuery({
    name: 'start',
    required: true,
    type: Number,
    description: 'Start row',
  })
  @ApiQuery({
    name: 'end',
    required: true,
    type: Number,
    description: 'End row',
  })
  @ApiOperation({ summary: 'Export applicants' })
  async exportApplicants(
    @Request() req,
    @Param('job_id') job_id: string,
    @Query('format') format: 'csv' | 'xlsx',
    @Query('start') start: number,
    @Query('end') end: number,
    @Res() res: any,
  ) {
    return this.jobsService.generateCSVOrXLSX(
      job_id,
      req.user,
      start,
      end,
      format,
      res,
    );
  }

  @ApiTags('lms')
  @Get('lms/saved-jobs/:job_seeker_id')
  @ApiOperation({ summary: 'List all jobs saved by a job seeker (for LMS)' })
  @ApiHeader({
    name: 'X-API-KEY',
    description: 'API Key for server-to-server communication',
  })
  findAllJobsSavedForLms(@Param('job_seeker_id') job_seeker_id: string) {
    return this.jobsService.findAllJobsSavedForLms(job_seeker_id);
  }

  @ApiTags('lms')
  @Get('jobs/lms/:job_id')
  @ApiOperation({ summary: 'Get detail of a public job (for LMS integration)' })
  findOneForLms(@Param('job_id') job_id: string) {
    return this.jobsService.findOneForLms(job_id);
  }
}
