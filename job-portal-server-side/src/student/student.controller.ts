import { Controller, Get, UseGuards, Query, Request, Param, Post, Res } from '@nestjs/common';
import { StudentService } from './student.service';
import { ApiBearerAuth, ApiOperation, ApiQuery, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';

@ApiTags('student-management')
@Controller('student')
export class StudentController {
  constructor(private readonly studentService: StudentService) { }

  @Get('management/registered')
  @ApiBearerAuth('access-token')
  @UseGuards(new JwtAuthGuard(['university']))
  @ApiOperation({ summary: 'List all students Registered to university' })
  @ApiQuery({ name: 'page', required: false, type: Number, example: 1, description: 'Page number' })
  @ApiQuery({ name: 'pageSize', required: false, type: Number, example: 10, description: 'Number of items per page' })
  @ApiQuery({ name: 'search', required: false, type: String, example: '', description: 'Search term' })
  @ApiQuery({ name: 'sortBy', required: false, type: String, example: '', description: 'Field to sort by' })
  @ApiQuery({ name: 'sortOrder', required: false, enum: ['asc', 'desc'], example: '', description: 'Sort order' })
  @ApiQuery({ name: 'classYear', required: false, type: Number, description: 'Class year' })
  @ApiQuery({ name: 'startDate', required: false, type: Number, description: 'Start date' })
  @ApiQuery({ name: 'endDate', required: false, type: Number, description: 'End date' })
  findAllStudents(
    @Request() req,
    @Query('page') page?: number,
    @Query('pageSize') pageSize?: number,
    @Query('search') search?: string,
    @Query('sortBy') sortBy?: string,
    @Query('sortOrder') sortOrder?: 'asc' | 'desc',
    @Query('classYear') classYear?: number,
    @Query('startDate') startDate?: string,
    @Query('endDate') endDate?: string,
  ) {
    return this.studentService.findAllStudents(req.user, { page, pageSize, search, sortBy, sortOrder, classYear, startDate, endDate });
  }

  @Get('/:job_seeker_id')
  @ApiBearerAuth('access-token')
  @UseGuards(new JwtAuthGuard(['university']))
  @ApiOperation({ summary: 'Get student detail by job seeker id' })
  getStudentByJobSeekerId(@Request() req, @Param('job_seeker_id') job_seeker_id: string) {
    return this.studentService.getStudentByJobSeekerId(req.user, job_seeker_id);
  }

  @Get('management/history')
  @ApiBearerAuth('access-token')
  @UseGuards(new JwtAuthGuard(['university']))
  @ApiOperation({ summary: 'List all student employment history' })
  @ApiQuery({ name: 'page', required: false, type: Number, example: 1, description: 'Page number' })
  @ApiQuery({ name: 'pageSize', required: false, type: Number, example: 10, description: 'Number of items per page' })
  @ApiQuery({ name: 'search', required: false, type: String, example: '', description: 'Search term' })
  @ApiQuery({ name: 'sortBy', required: false, type: String, example: '', description: 'Field to sort by' })
  @ApiQuery({ name: 'sortOrder', required: false, enum: ['asc', 'desc'], example: '', description: 'Sort order' })
  @ApiQuery({ name: 'classYear', required: false, type: Number, description: 'Class year' })
  @ApiQuery({ name: 'status', required: false, enum: ['pending', 'accepted', 'rejected'], description: 'Employment status' })
  @ApiQuery({ name: 'employmentType', required: false, enum: ['freelance', 'full_time', 'part_time'], description: 'Employment type' })
  async getStudentEmploymentHistory(
    @Request() req,
    @Query('page') page?: number,
    @Query('pageSize') pageSize?: number,
    @Query('search') search?: string,
    @Query('sortBy') sortBy?: string,
    @Query('sortOrder') sortOrder?: 'asc' | 'desc',
    @Query('classYear') classYear?: number,
    @Query('status') status?: 'pending' | 'accepted' | 'rejected',
    @Query('employmentType') employmentType?: 'internship' | 'fulltime' | 'parttime'
  ) {
    return this.studentService.getStudentEmploymentHistory(req.user, { page, pageSize, search, sortBy, sortOrder, classYear, status, employmentType });
  }

  @Post('management/registered/export')
  @ApiBearerAuth('access-token')
  @UseGuards(new JwtAuthGuard(['university']))
  @ApiOperation({ summary: 'Export Registered Student' })
  @ApiQuery({ name: 'format', required: true, enum: ['csv', 'xlsx'], description: 'Export format' })
  @ApiQuery({ name: 'start', required: true, type: Number, description: 'Start row' })
  @ApiQuery({ name: 'end', required: true, type: Number, description: 'End row' })
  exportRegisteredStudent(
    @Request() req,
    @Query('format') format: 'csv' | 'xlsx',
    @Query('start') start: number,
    @Query('end') end: number,
    @Res() res: any
  ) {
    return this.studentService.exportRegisteredStudent(req.user, start, end, format, res);
  }

  @Post('management/history/export')
  @ApiBearerAuth('access-token')
  @UseGuards(new JwtAuthGuard(['university']))
  @ApiOperation({ summary: 'Export Student Employment History' })
  @ApiQuery({ name: 'format', required: true, enum: ['csv', 'xlsx'], description: 'Export format' })
  @ApiQuery({ name: 'start', required: true, type: Number, description: 'Start row' })
  @ApiQuery({ name: 'end', required: true, type: Number, description: 'End row' })
  exportHistoryStudent(
    @Request() req,
    @Query('format') format: 'csv' | 'xlsx',
    @Query('start') start: number,
    @Query('end') end: number,
    @Res() res: any
  ) {
    return this.studentService.exportHistoryStudent(req.user, start, end, format, res);
  }
}
