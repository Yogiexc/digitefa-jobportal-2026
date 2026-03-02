import { Controller, Get, Query, Request, UseGuards } from '@nestjs/common';
import { CompanyService } from './company.service';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';

@ApiTags('dashboard-company')
@Controller('dashboard/cms/company')
export class CompanyController {
  constructor(private readonly companyService: CompanyService) { }

  @Get('total-job-vacancies')
  @ApiBearerAuth('access-token')
  @UseGuards(new JwtAuthGuard(['company']))
  @ApiOperation({ summary: 'Get total job vacancy' })
  async totalTalents(
    @Request() req,
  ) {
    return this.companyService.getTotalJobVacancies(req.user);
  }

  @Get('job-overview')
  @ApiBearerAuth('access-token')
  @UseGuards(new JwtAuthGuard(['company']))
  @ApiOperation({ summary: 'Get job overview' })
  async jobOverview(
    @Request() req,
    @Query('year') year?: number,
  ) {
    return this.companyService.getJobOverview(req.user, year);
  }

  @Get('talents-acceptance-ratio')
  @ApiBearerAuth('access-token')
  @UseGuards(new JwtAuthGuard(['company']))
  @ApiOperation({ summary: 'Get talents acceptance ratio' })
  async talentsAcceptanceRatio(
    @Request() req,
  ) {
    return this.companyService.talentsAcceptanceRatio(req.user);
  }

}
