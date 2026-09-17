import { Controller, Get, Param } from '@nestjs/common';
import { V3Service } from './v3.service';
import { ApiOperation, ApiTags } from '@nestjs/swagger';

@ApiTags('v3')
@Controller('v3')
export class V3Controller {
  constructor(private readonly v3Service: V3Service) { }

  @Get('jobs')
  @ApiOperation({ summary: 'List all jobs' })
  getJobs(
  ) {
    return this.v3Service.getJobs();
  }

  @Get('user-profile/:job_seeker_id')
  // @ApiBearerAuth('access-token')
  // @UseGuards(new JwtAuthGuard(['superadmin']))
  @ApiOperation({ summary: 'Get user profile' })
  getUserProfile(
    @Param('job_seeker_id') job_seeker_id: string
  ) {
    return this.v3Service.getUserProfile(job_seeker_id);
  }


}
