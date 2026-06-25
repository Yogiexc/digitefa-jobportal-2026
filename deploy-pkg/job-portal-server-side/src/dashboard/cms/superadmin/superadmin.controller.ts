import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { SuperadminService } from './superadmin.service';
import { ApiBearerAuth, ApiOperation, ApiQuery, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';

@ApiTags('dashboard-superadmin')
@Controller('dashboard/cms/superadmin')
export class SuperadminController {
  constructor(private readonly superadminService: SuperadminService) { }

  @Get('total-talents')
  @ApiBearerAuth('access-token')
  @UseGuards(new JwtAuthGuard(['superadmin']))
  @ApiOperation({ summary: 'Get total talents' })
  @ApiQuery({ name: 'time', required: false, enum: ['week', 'month', 'all'], example: 'all', description: 'Time period' })
  async totalTalents(
    @Query('time') time: 'week' | 'month' | 'all' = 'all',
  ) {
    return this.superadminService.getTotalTalents(time);
  }

  @Get('total-companies')
  @ApiBearerAuth('access-token')
  @UseGuards(new JwtAuthGuard(['superadmin']))
  @ApiOperation({ summary: 'Get total companies' })
  @ApiQuery({ name: 'time', required: false, enum: ['week', 'month', 'all'], example: 'all', description: 'Time period' })
  async totalCompanies(
    @Query('time') time: 'week' | 'month' | 'all' = 'all',
  ) {
    return this.superadminService.getTotalCompanies(time);
  }

  @Get('total-universities')
  @ApiBearerAuth('access-token')
  @UseGuards(new JwtAuthGuard(['superadmin']))
  @ApiOperation({ summary: 'Get total universities' })
  @ApiQuery({ name: 'time', required: false, enum: ['week', 'month', 'all'], example: 'all', description: 'Time period' })
  async totalUniversities(
    @Query('time') time: 'week' | 'month' | 'all' = 'all',
  ) {
    return this.superadminService.getTotalUniversities(time);
  }

  @Get('recent-jobs')
  @ApiBearerAuth('access-token')
  @UseGuards(new JwtAuthGuard(['superadmin']))
  @ApiOperation({ summary: 'Get recent jobs' })
  @ApiQuery({ name: 'limit', required: false, example: 5, description: 'Number of jobs' })
  async recentJobs(
    @Query('limit') limit: number = 5,
  ) {
    return this.superadminService.getRecentJobs(limit);
  }

  @Get('talents-overview')
  @ApiBearerAuth('access-token')
  @UseGuards(new JwtAuthGuard(['superadmin']))
  @ApiOperation({ summary: 'Get talents overview' })
  @ApiQuery({ name: 'week', required: true, type: Number, example: 1, description: 'Week number' })
  @ApiQuery({ name: 'month', required: true, type: Number, example: 1, description: 'Month number' })
  getTalentsOverview(
    @Query('week') week: number,
    @Query('month') month: number,
  ) {
    return this.superadminService.getTalentsOverview(week, month);
  }

  @Get('companies-universities-overview')
  @ApiBearerAuth('access-token')
  @UseGuards(new JwtAuthGuard(['superadmin']))
  @ApiOperation({ summary: 'Get companies and universities overview' })
  @ApiQuery({ name: 'month', required: true, type: Number, example: 1, description: 'Month number' })
  getCompaniesUniversitiesOverview(
    @Query('month') month: number,
  ) {
    return this.superadminService.getCompaniesUniversitiesOverview(month);
  }
}
