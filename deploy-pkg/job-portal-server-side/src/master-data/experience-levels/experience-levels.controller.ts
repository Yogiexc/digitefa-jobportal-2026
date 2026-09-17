import { Controller, Get, Post, Body, Param, Delete, Query, Put, UseGuards } from '@nestjs/common';
import { ExperienceLevelsService } from './experience-levels.service';
import { CreateExperienceLevelDto } from './dto/create-experience-level.dto';
import { UpdateExperienceLevelDto } from './dto/update-experience-level.dto';
import { ApiBearerAuth, ApiConsumes, ApiOperation, ApiQuery, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';

@ApiTags('experience-levels')
@Controller('experience-levels')
export class ExperienceLevelsController {
  constructor(private readonly experienceLevelsService: ExperienceLevelsService) { }

  @Post()
  @ApiConsumes('multipart/form-data')
  @ApiConsumes('application/json')
  @ApiBearerAuth('access-token')
  @UseGuards(new JwtAuthGuard(['superadmin']))
  @ApiOperation({ summary: 'Create a experience level' })
  create(@Body() createExperienceLevelDto: CreateExperienceLevelDto) {
    return this.experienceLevelsService.create(createExperienceLevelDto);
  }

  @Get()
  @ApiOperation({ summary: 'List all experience level' })
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
    return this.experienceLevelsService.findAll({ page, pageSize, search, sortBy, sortOrder });
  }

  @Get(':experience_level_id')
  @ApiBearerAuth('access-token')
  @UseGuards(new JwtAuthGuard(['superadmin']))
  @ApiOperation({ summary: 'Get a experience level' })
  findOne(@Param('experience_level_id') experience_level_id: string) {
    return this.experienceLevelsService.findOne(experience_level_id);
  }

  @Put(':experience_level_id')
  @ApiConsumes('multipart/form-data')
  @ApiConsumes('application/json')
  @ApiBearerAuth('access-token')
  @UseGuards(new JwtAuthGuard(['superadmin']))
  @ApiOperation({ summary: 'Update a experience level' })
  update(@Param('experience_level_id') experience_level_id: string, @Body() updateExperienceLevelDto: UpdateExperienceLevelDto) {
    return this.experienceLevelsService.update(experience_level_id, updateExperienceLevelDto);
  }

  @Delete(':experience_level_id')
  @ApiConsumes('multipart/form-data')
  @ApiConsumes('application/json')
  @ApiBearerAuth('access-token')
  @UseGuards(new JwtAuthGuard(['superadmin']))
  @ApiOperation({ summary: 'Delete a experience level' })
  remove(@Param('experience_level_id') experience_level_id: string) {
    return this.experienceLevelsService.remove(experience_level_id);
  }

}
