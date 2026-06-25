import { Body, Controller, Get, Param, Post, Query, UseGuards } from '@nestjs/common';
import { UniversitiesService } from './universities.service';
import { ApiBearerAuth, ApiConsumes, ApiOperation, ApiQuery, ApiTags } from '@nestjs/swagger';
import { ChangeStatusUniversityDto } from './dto/change-status-university.dto';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';

@ApiTags('universities')
@Controller('universities')
export class UniversitiesController {
  constructor(private readonly universitiesService: UniversitiesService) { }

  // @Post()
  // @ApiOperation({ summary: 'Create a university' })
  // create(@Body() createUniversityDto: CreateUniversityDto) {
  //   return this.universitiesService.create(createUniversityDto);
  // }

  @Get('management')
  @ApiBearerAuth('access-token')
  @UseGuards(new JwtAuthGuard(['superadmin']))
  @ApiOperation({ summary: 'List all university (University Management)' })
  @ApiQuery({ name: 'page', required: false, type: Number, example: 1, description: 'Page number' })
  @ApiQuery({ name: 'pageSize', required: false, type: Number, example: 10, description: 'Number of items per page' })
  @ApiQuery({ name: 'search', required: false, type: String, example: '', description: 'Search term' })
  @ApiQuery({ name: 'sortBy', required: false, type: String, example: '', description: 'Field to sort by' })
  @ApiQuery({ name: 'sortOrder', required: false, enum: ['asc', 'desc'], example: 'asc', description: 'Sort order' })
  findAllUniversityManagement(
    @Query('page') page?: number,
    @Query('pageSize') pageSize?: number,
    @Query('search') search?: string,
    @Query('sortBy') sortBy?: string,
    @Query('sortOrder') sortOrder?: 'asc' | 'desc'
  ) {
    return this.universitiesService.findAllUniversityManagement({ page, pageSize, search, sortBy, sortOrder });
  }

  @Get()
  @ApiBearerAuth('access-token')
  @UseGuards(new JwtAuthGuard(['superadmin']))
  @ApiOperation({ summary: 'List all university' })
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
    return this.universitiesService.findAll({ page, pageSize, search, sortBy, sortOrder });
  }
  @Get('list')
  @ApiOperation({ summary: 'List all university for profile job seeker' })
  findAllList(
  ) {
    return this.universitiesService.findAllList();
  }

  @Get(':university_id')
  @ApiBearerAuth('access-token')
  @UseGuards(new JwtAuthGuard(['superadmin']))
  @ApiOperation({ summary: 'Get a university' })
  findOne(@Param('university_id') university_id: string) {
    return this.universitiesService.findOne(university_id);
  }

  @Post('change-status')
  @ApiConsumes('application/json')
  @ApiConsumes('multipart/form-data')
  @ApiBearerAuth('access-token')
  @UseGuards(new JwtAuthGuard(['superadmin']))
  @ApiOperation({ summary: 'Change university status' })
  changeStatus(@Body() changeStatusDto: ChangeStatusUniversityDto) {
    return this.universitiesService.changeStatusUniversity(changeStatusDto.university_id, changeStatusDto.status, changeStatusDto.notes);
  }

  // @Put(':university_id')
  // @ApiOperation({ summary: 'Update a university' })
  // update(@Param('university_id') university_id: string, @Body() updateUniversityDto: UpdateUniversityDto) {
  //   return this.universitiesService.update(university_id, updateUniversityDto);
  // }

  // @Delete(':university_id')
  // @ApiOperation({ summary: 'Delete a university' })
  // remove(@Param('university_id') university_id: string) {
  //   return this.universitiesService.remove(university_id);
  // }
}
