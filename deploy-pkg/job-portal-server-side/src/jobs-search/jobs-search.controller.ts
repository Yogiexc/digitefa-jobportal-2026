import {
  Controller,
  DefaultValuePipe,
  Get,
  Param,
  ParseArrayPipe,
  Query,
  Request,
  UseGuards,
} from '@nestjs/common';
import { JobsSearchService } from './jobs-search.service';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiParam,
  ApiQuery,
  ApiTags,
} from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';

@ApiTags('jobs-search')
@Controller('jobs-search')
export class JobsSearchController {
  constructor(private readonly jobsSearchService: JobsSearchService) {}

  @Get()
  @ApiBearerAuth('access-token')
  @UseGuards(new JwtAuthGuard(['public', 'job_seeker']))
  @ApiOperation({ summary: 'Jobs Search' })
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
    description: 'Search by Name',
  })
  @ApiQuery({
    name: 'location',
    required: false,
    type: String,
    example: '',
    description: 'Search by Location',
  })
  @ApiQuery({
    name: 'sortBy',
    required: false,
    enum: ['most_relevant', 'most_recent'],
    description: 'Field to sort by',
  })
  @ApiQuery({
    name: 'recommendationSort',
    required: false,
    type: [String],
    description: 'Recommendation sort by',
  })
  @ApiQuery({
    name: 'employmentType',
    required: false,
    type: [String],
    description: 'Employment Type (can be multiple)',
  })
  @ApiQuery({
    name: 'salaryType',
    required: false,
    type: [String],
    description: 'Salary Type (can be multiple)',
  })
  @ApiQuery({
    name: 'minimumSalary',
    required: false,
    type: Number,
    description: 'Minimum Salary',
  })
  @ApiQuery({
    name: 'maximumSalary',
    required: false,
    type: Number,
    description: 'Maximum Salary',
  })
  @ApiQuery({
    name: 'category',
    required: false,
    type: [String],
    description: 'Job Category (can be multiple)',
  })
  @ApiQuery({
    name: 'educationLevel',
    required: false,
    type: [String],
    description: 'Education Level (can be multiple)',
  })
  @ApiQuery({
    name: 'experienceLevel',
    required: false,
    type: [String],
    description: 'Experience Level (can be multiple)',
  })
  async findJobs(
    @Request() req?,
    @Query('page') page?: number,
    @Query('pageSize') pageSize?: number,
    @Query('search') search?: string,
    @Query('location') location?: string,
    @Query('sortBy') sortBy?: 'most_relevant' | 'most_recent',
    @Query(
      'recommendationSort',
      new DefaultValuePipe([]),
      new ParseArrayPipe({ items: String, optional: true, separator: ',' }),
    )
    recommendationSort?: string[],
    @Query('employmentType') employmentType?: string[],
    @Query('salaryType') salaryType?: string[],
    @Query('minimumSalary') minimumSalary?: number,
    @Query('maximumSalary') maximumSalary?: number,
    @Query('category') category?: string[],
    @Query('educationLevel') educationLevel?: string[],
    @Query('experienceLevel') experienceLevel?: string[],
  ) {
    return this.jobsSearchService.findJobs(req?.user, {
      page,
      pageSize,
      search,
      location,
      sortBy,
      recommendationSort,
      employmentType,
      salaryType,
      minimumSalary,
      maximumSalary,
      category,
      educationLevel,
      experienceLevel,
    });
  }

  @Get('company/:company_id')
  @ApiBearerAuth('access-token')
  @UseGuards(new JwtAuthGuard(['public', 'job_seeker']))
  @ApiOperation({ summary: 'Get Company Jobs' })
  @ApiParam({
    name: 'company_id',
    required: true,
    type: String,
    example: '123',
    description: 'Company ID',
  })
  async getDetailCompany(
    @Request() req,
    @Param('company_id') company_id: string,
  ) {
    return this.jobsSearchService.getDetailCompany(req?.user, company_id);
  }

  @Get('/:job_id')
  @ApiBearerAuth('access-token')
  @UseGuards(new JwtAuthGuard(['public', 'job_seeker']))
  @ApiOperation({ summary: 'Get Detail Job' })
  @ApiParam({
    name: 'job_id',
    required: true,
    type: String,
    example: '123',
    description: 'Job ID',
  })
  async getDetailJob(@Request() req, @Param('job_id') job_id: string) {
    return this.jobsSearchService.getDetailJob(req?.user, job_id);
  }
}
