import { Controller, Get, Post, Body, Param, Delete, Query, Put, UseGuards } from '@nestjs/common';
import { PositionLevelsService } from './position-levels.service';
import { CreatePositionLevelDto } from './dto/create-position-level.dto';
import { UpdatePositionLevelDto } from './dto/update-position-level.dto';
import { ApiBearerAuth, ApiConsumes, ApiOperation, ApiQuery, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';

@ApiTags('position-levels')
@Controller('position-levels')
export class PositionLevelsController {
  constructor(private readonly positionLevelsService: PositionLevelsService) { }

  @Post()
  @ApiConsumes('multipart/form-data')
  @ApiConsumes('application/json')
  @ApiBearerAuth('access-token')
  @UseGuards(new JwtAuthGuard(['superadmin']))
  @ApiOperation({ summary: 'Create a position level' })
  create(@Body() createPositionLevelDto: CreatePositionLevelDto) {
    return this.positionLevelsService.create(createPositionLevelDto);
  }

  @Get()
  @ApiOperation({ summary: 'List all position level' })
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
    return this.positionLevelsService.findAll({ page, pageSize, search, sortBy, sortOrder });
  }

  @Get(':position_level_id')
  @ApiBearerAuth('access-token')
  @UseGuards(new JwtAuthGuard(['superadmin']))
  @ApiOperation({ summary: 'Get a position level' })
  findOne(@Param('position_level_id') position_level_id: string) {
    return this.positionLevelsService.findOne(position_level_id);
  }

  @Put(':position_level_id')
  @ApiConsumes('multipart/form-data')
  @ApiConsumes('application/json')
  @ApiBearerAuth('access-token')
  @UseGuards(new JwtAuthGuard(['superadmin']))
  @ApiOperation({ summary: 'Update a position level' })
  update(@Param('position_level_id') position_level_id: string, @Body() updatePositionLevelDto: UpdatePositionLevelDto) {
    return this.positionLevelsService.update(position_level_id, updatePositionLevelDto);
  }

  @Delete(':position_level_id')
  @ApiConsumes('multipart/form-data')
  @ApiConsumes('application/json')
  @ApiBearerAuth('access-token')
  @UseGuards(new JwtAuthGuard(['superadmin']))
  @ApiOperation({ summary: 'Delete a position level' })
  remove(@Param('position_level_id') position_level_id: string) {
    return this.positionLevelsService.remove(position_level_id);
  }

}
