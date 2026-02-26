import { Body, Controller, Get, Param, Post, Query, UseGuards } from '@nestjs/common';
import { CompaniesService } from './companies.service';
import { ApiBearerAuth, ApiConsumes, ApiOperation, ApiQuery, ApiTags } from '@nestjs/swagger';
import { ChangeStatusCompanyDto } from './dto/change-status-company.dto';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';

@ApiTags('companies')
@Controller('companies')
export class CompaniesController {
  constructor(private readonly companiesService: CompaniesService) { }

  // @Post()
  // @ApiOperation({ summary: 'Create a company' })
  // create(@Body() createCompanyDto: CreateCompanyDto) {
  //   return this.companiesService.create(createCompanyDto);
  // }

  @Get('management')
  @ApiBearerAuth('access-token')
  @UseGuards(new JwtAuthGuard(['superadmin']))
  @ApiOperation({ summary: 'List all company (Company Management)' })
  @ApiQuery({ name: 'page', required: false, type: Number, example: 1, description: 'Page number' })
  @ApiQuery({ name: 'pageSize', required: false, type: Number, example: 10, description: 'Number of items per page' })
  @ApiQuery({ name: 'search', required: false, type: String, example: '', description: 'Search term' })
  @ApiQuery({ name: 'sortBy', required: false, type: String, example: '', description: 'Field to sort by' })
  @ApiQuery({ name: 'sortOrder', required: false, enum: ['asc', 'desc'], example: 'asc', description: 'Sort order' })
  findAllCompanyManagement(
    @Query('page') page?: number,
    @Query('pageSize') pageSize?: number,
    @Query('search') search?: string,
    @Query('sortBy') sortBy?: string,
    @Query('sortOrder') sortOrder?: 'asc' | 'desc'
  ) {
    return this.companiesService.findAllCompanyManagement({ page, pageSize, search, sortBy, sortOrder });
  }

  @Get()
  @ApiBearerAuth('access-token')
  @UseGuards(new JwtAuthGuard(['superadmin']))
  @ApiOperation({ summary: 'List all company' })
  @ApiQuery({ name: 'page', required: false, type: Number, example: 1, description: 'Page number' })
  @ApiQuery({ name: 'pageSize', required: false, type: Number, example: 10, description: 'Number of items per page' })
  @ApiQuery({ name: 'search', required: false, type: String, example: '', description: 'Search term' })
  @ApiQuery({ name: 'sortBy', required: false, type: String, example: '', description: 'Field to sort by' })
  @ApiQuery({ name: 'sortOrder', required: false, enum: ['asc', 'desc'], example: 'asc', description: 'Sort order' })
  findAll(
    @Query('page') page?: number,
    @Query('pageSize') pageSize?: number,
    @Query('search') search?: string,
    @Query('sortBy') sortBy?: string,
    @Query('sortOrder') sortOrder?: 'asc' | 'desc'
  ) {
    return this.companiesService.findAll({ page, pageSize, search, sortBy, sortOrder });
  }

  @Get(':company_id')
  @ApiBearerAuth('access-token')
  @UseGuards(new JwtAuthGuard(['superadmin']))
  @ApiOperation({ summary: 'Get a company' })
  findOne(@Param('company_id') company_id: string) {
    return this.companiesService.findOne(company_id);
  }

  @Post('change-status')
  @ApiConsumes('application/json')
  @ApiConsumes('multipart/form-data')
  @ApiBearerAuth('access-token')
  @UseGuards(new JwtAuthGuard(['superadmin']))
  @ApiOperation({ summary: 'Change company status' })
  changeStatus(@Body() changeStatusDto: ChangeStatusCompanyDto) {
    return this.companiesService.changeStatusCompany(changeStatusDto.company_id, changeStatusDto.status, changeStatusDto.notes);
  }

  // @Put(':company_id')
  // @ApiOperation({ summary: 'Update a company' })
  // update(@Param('company_id') company_id: string, @Body() updateCompanyDto: UpdateCompanyDto) {
  //   return this.companiesService.update(company_id, updateCompanyDto);
  // }

  // @Delete(':company_id')
  // @ApiOperation({ summary: 'Delete a company' })
  // remove(@Param('company_id') company_id: string) {
  //   return this.companiesService.remove(company_id);
  // }
}
