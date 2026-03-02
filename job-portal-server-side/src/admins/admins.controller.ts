import { Body, Controller, Delete, Get, Param, Post, Put, Query, Request, UseGuards } from '@nestjs/common';
import { AdminsService } from './admins.service';
import { ApiBearerAuth, ApiConsumes, ApiOperation, ApiQuery, ApiTags } from '@nestjs/swagger';
import { CreateAdminDto } from './dto/create-admins.dto';
import { UpdateAdminDto } from './dto/update-admins.dto';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';

@ApiTags('admins')
@Controller('admins')
export class AdminsController {
  constructor(private readonly adminsService: AdminsService) { }

  @Post()
  @ApiConsumes('multipart/form-data')
  @ApiConsumes('application/json')
  @ApiBearerAuth('access-token')
  @UseGuards(new JwtAuthGuard(['superadmin']))
  @ApiOperation({ summary: 'Create a admin' })
  create(@Request() req, @Body() createAdminDto: CreateAdminDto) {
    return this.adminsService.create(req.user, createAdminDto);
  }

  @Get()
  @ApiBearerAuth('access-token')
  @UseGuards(new JwtAuthGuard(['superadmin']))
  @ApiOperation({ summary: 'List all admin' })
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
    return this.adminsService.findAll({ page, pageSize, search, sortBy, sortOrder });
  }

  @Get(':admin_id')
  @ApiBearerAuth('access-token')
  @UseGuards(new JwtAuthGuard(['superadmin']))
  @ApiOperation({ summary: 'Get a admin' })
  findOne(@Param('admin_id') admin_id: string) {
    return this.adminsService.findOne(admin_id);
  }

  @Put(':admin_id')
  @ApiConsumes('multipart/form-data')
  @ApiConsumes('application/json')
  @ApiBearerAuth('access-token')
  @UseGuards(new JwtAuthGuard(['superadmin']))
  @ApiOperation({ summary: 'Update a admin' })
  update(@Request() req, @Param('admin_id') admin_id: string, @Body() updateAdminDto: UpdateAdminDto) {
    return this.adminsService.update(req.user, admin_id, updateAdminDto);
  }

  @Delete(':admin_id')
  @ApiBearerAuth('access-token')
  @UseGuards(new JwtAuthGuard(['superadmin']))
  @ApiOperation({ summary: 'Delete a admin' })
  remove(@Request() req, @Param('admin_id') admin_id: string) {
    return this.adminsService.remove(req.user, admin_id);
  }
}
