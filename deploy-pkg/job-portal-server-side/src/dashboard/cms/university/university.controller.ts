import { Controller, Get, Query, Request, UseGuards } from '@nestjs/common';
import { UniversityService } from './university.service';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';

@ApiTags('dashboard-university')
@Controller('dashboard/cms/university')
export class UniversityController {
  constructor(private readonly universityService: UniversityService) { }

  @Get('total-students')
  @ApiBearerAuth('access-token')
  @UseGuards(new JwtAuthGuard(['university']))
  @ApiOperation({ summary: 'Get total students' })
  async totalStudents(
    @Request() req,
  ) {
    return this.universityService.getTotalStudents(req.user);
  }

  @Get('student-activities')
  @ApiBearerAuth('access-token')
  @UseGuards(new JwtAuthGuard(['university']))
  @ApiOperation({ summary: 'Get Student Activities' })
  async studentActivities(
    @Request() req,
    @Query('year') year?: number,
  ) {
    return this.universityService.studentActivities(req.user, year);
  }

  @Get('enrolled-students')
  @ApiBearerAuth('access-token')
  @UseGuards(new JwtAuthGuard(['university']))
  @ApiOperation({ summary: 'Get Enrolled Students' })
  async enrolledStudents(
    @Request() req,
  ) {
    return this.universityService.getEnrolledStudents(req.user);
  }

  @Get('student-employment-ratio')
  @ApiBearerAuth('access-token')
  @UseGuards(new JwtAuthGuard(['university']))
  @ApiOperation({ summary: 'Get student employment ratio' })
  async studentEmploymentRatio(
    @Request() req,
  ) {
    return this.universityService.studentEmploymentRatio(req.user);
  }


}
