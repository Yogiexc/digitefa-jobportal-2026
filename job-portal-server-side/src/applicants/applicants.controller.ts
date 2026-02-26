import { Controller, Post, Body, Param, UseGuards, BadRequestException, UseInterceptors, Request, UploadedFile, Query, Get, Res } from '@nestjs/common';
import { ApplicantsService } from './applicants.service';
import { ApiBearerAuth, ApiConsumes, ApiOperation, ApiQuery, ApiTags, ApiHeader } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { ApplyJobDto } from './dto/apply-job.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { ApiKeyGuard } from 'src/auth/guards/api-key.guard';
import { FindAllAppliedJobsForLmsDto } from './dto/find-all-applied-jobs-for-lms.dto';

@Controller()
export class ApplicantsController {
  constructor(private readonly applicantsService: ApplicantsService) {}

  @ApiTags('job-seeker-apply-jobs')
  @Post('apply-jobs/:job_id')
  @ApiConsumes('application/json')
  @ApiConsumes('multipart/form-data')
  @ApiBearerAuth('access-token')
  @UseGuards(new JwtAuthGuard(['job_seeker']))
  @ApiOperation({ summary: 'Apply Jobs for job seekers' })
  @UseInterceptors(
    FileInterceptor('upload_resume', {
      storage: diskStorage({
        destination: './public/uploads/resume',
        filename: (req, file, cb) => {
          const uniqueSuffix =
            Date.now() + '-' + Math.round(Math.random() * 1e9);
          const ext = extname(file.originalname);
          const filename = `resume-${uniqueSuffix}${ext}`;
          cb(null, filename);
        },
      }),
      fileFilter: (req, file, cb) => {
        if (!file.mimetype.match(/\/(jpg|jpeg|png|pdf)$/)) {
          cb(
            new BadRequestException(
              'Only image (jpg, jpeg, png) and PDF files are allowed!',
            ),
            false,
          );
        } else {
          cb(null, true);
        }
      },
    }),
  )
  async applyJob(
    @Request() req,
    @Param('job_id') job_id: string,
    @Body() applyJobDto: ApplyJobDto,
    @UploadedFile() resume?: Express.Multer.File,
  ) {
    const applyJob = Object.fromEntries(
      Object.entries(applyJobDto).filter(
        ([key]) => !['upload_resume'].includes(key),
      ),
    );
    return this.applicantsService.applyJob(req.user, job_id, applyJob, resume);
  }

  @ApiTags('job-seeker-applied-jobs')
  @Get('applied-jobs')
  @ApiBearerAuth('access-token')
  @UseGuards(new JwtAuthGuard(['job_seeker']))
  @ApiOperation({ summary: 'List all jobs applied by job seeker' })
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
    type: String,
    example: 'applied',
    description: 'Filter by status',
  })
  findAllJobsApplied(
    @Request() req,
    @Query('page') page?: number,
    @Query('pageSize') pageSize?: number,
    @Query('search') search?: string,
    @Query('sortBy') sortBy?: string,
    @Query('sortOrder') sortOrder?: 'asc' | 'desc',
    @Query('status') status?: string,
  ) {
    return this.applicantsService.findAllJobsApplied(req.user, {
      page,
      pageSize,
      search,
      sortBy,
      sortOrder,
      status,
    });
  }

  @ApiTags('job-seeker-applied-jobs')
  @Get('detail-applied-jobs:/application_id')
  @ApiBearerAuth('access-token')
  @UseGuards(new JwtAuthGuard(['job_seeker']))
  @ApiOperation({ summary: 'Detail jobs applied by job seeker' })
  detailJobsApplied(
    @Request() req,
    @Param('application_id') application_id: string,
  ) {
    return this.applicantsService.detailJobsApplied(req.user, application_id);
  }

  @ApiTags('job-seekers')
  @ApiTags('student-management')
  @Post('applied-jobs/:job_seeker_id/export')
  @ApiBearerAuth('access-token')
  @UseGuards(new JwtAuthGuard(['superadmin', 'university']))
  @ApiOperation({
    summary:
      'Export all jobs applied history by job seeker (company & superadmin)',
  })
  @ApiQuery({
    name: 'format',
    required: true,
    enum: ['csv', 'xlsx'],
    description: 'Export format',
  })
  async exportAllJobsAppliedHistory(
    @Param('job_seeker_id') job_seeker_id: string,
    @Query('format') format: 'csv' | 'xlsx',
    @Res() res: any,
  ) {
    return this.applicantsService.exportAllJobsAppliedHistory(
      job_seeker_id,
      format,
      res,
    );
  }

  @ApiTags('job-seekers')
  @ApiTags('student-management')
  @Get('applied-jobs/:job_seeker_id')
  @ApiBearerAuth('access-token')
  @UseGuards(new JwtAuthGuard(['superadmin', 'university']))
  @ApiOperation({
    summary: 'List all jobs applied by job seeker (company & superadmin)',
  })
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
    type: String,
    example: 'applied',
    description: 'Filter by status',
  })
  async findAllJobsAppliedHistory(
    @Param('job_seeker_id') job_seeker_id: string,
    @Query('page') page?: number,
    @Query('pageSize') pageSize?: number,
    @Query('search') search?: string,
    @Query('sortBy') sortBy?: string,
    @Query('sortOrder') sortOrder?: 'asc' | 'desc',
    @Query('status') status?: string,
  ) {
    return this.applicantsService.findAllJobsAppliedHistory(job_seeker_id, {
      page,
      pageSize,
      search,
      sortBy,
      sortOrder,
      status,
    });
  }

  @ApiTags('lms')
  @Get('lms/applied-jobs/:job_seeker_id')
  @UseGuards(ApiKeyGuard)
  @ApiOperation({
    summary: 'List ALL jobs applied by a job seeker (for LMS, no pagination)',
  })
  @ApiHeader({
    name: 'X-API-KEY',
    description: 'API Key for server-to-server communication',
  })
  @ApiQuery({ name: 'search', required: false, type: String })
  @ApiQuery({ name: 'sortBy', required: false, type: String })
  @ApiQuery({ name: 'sortOrder', required: false, enum: ['asc', 'desc'] })
  @ApiQuery({ name: 'status', required: false, type: String })
  findAllJobsAppliedForLms(
    @Param('job_seeker_id') job_seeker_id: string,
    @Query() queryOptions: FindAllAppliedJobsForLmsDto,
  ) {
    return this.applicantsService.findAllJobsAppliedForLms(
      job_seeker_id,
      queryOptions,
    );
  }
}
