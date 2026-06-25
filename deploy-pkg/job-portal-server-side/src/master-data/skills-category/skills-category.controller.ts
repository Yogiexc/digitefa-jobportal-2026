import { Controller, Get, Post, Body, Param, Delete, Put, Query, UseGuards } from '@nestjs/common';
import { SkillsCategoryService } from './skills-category.service';
import { CreateSkillsCategoryDto } from './dto/create-skills-category.dto';
import { UpdateSkillsCategoryDto } from './dto/update-skills-category.dto';
import { ApiBearerAuth, ApiConsumes, ApiOperation, ApiQuery, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';

@ApiTags('skills-category')
@Controller('skills-category')
export class SkillsCategoryController {
  constructor(private readonly skillsCategoryService: SkillsCategoryService) { }

  @Post()
  @ApiConsumes('multipart/form-data')
  @ApiConsumes('application/json')
  @ApiBearerAuth('access-token')
  @UseGuards(new JwtAuthGuard(['superadmin']))
  @ApiOperation({ summary: 'Create a skill category' })
  create(@Body() createSkillsCategoryDto: CreateSkillsCategoryDto) {
    return this.skillsCategoryService.create(createSkillsCategoryDto);
  }

  @Get()
  @ApiOperation({ summary: 'List all skill category' })
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
    return this.skillsCategoryService.findAll({ page, pageSize, search, sortBy, sortOrder });
  }

  @Get(':skill_category_id')
  @ApiBearerAuth('access-token')
  @UseGuards(new JwtAuthGuard(['superadmin']))
  @ApiOperation({ summary: 'Get a skill category' })
  findOne(@Param('skill_category_id') skill_category_id: string) {
    return this.skillsCategoryService.findOne(skill_category_id);
  }

  @Get('/list-skills/:skill_category_id')
  @ApiOperation({ summary: 'List all skills in a skill category by category id' })
  getListSkills(@Param('skill_category_id') skill_category_id: string) {
    return this.skillsCategoryService.getListSkills(skill_category_id);
  }

  @Get('/list-skills-name/:category_name')
  @ApiOperation({ summary: 'List all skills in a skill category by category name' })
  getListSkillsByCategoryName(@Param('category_name') category_name: string) {
    return this.skillsCategoryService.getListSkillsByCategoryName(category_name);
  }



  @Put(':skill_category_id')
  @ApiConsumes('multipart/form-data')
  @ApiConsumes('application/json')
  @ApiBearerAuth('access-token')
  @UseGuards(new JwtAuthGuard(['superadmin']))
  @ApiOperation({ summary: 'Update a skill category' })
  update(@Param('skill_category_id') skill_category_id: string, @Body() updateSkillsCategoryDto: UpdateSkillsCategoryDto) {
    return this.skillsCategoryService.update(skill_category_id, updateSkillsCategoryDto);
  }

  @Delete(':skill_category_id')
  @ApiBearerAuth('access-token')
  @UseGuards(new JwtAuthGuard(['superadmin']))
  @ApiOperation({ summary: 'Delete a skill category' })
  remove(@Param('skill_category_id') skill_category_id: string) {
    return this.skillsCategoryService.remove(skill_category_id);
  }
}
