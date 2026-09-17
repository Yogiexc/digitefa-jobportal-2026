import { Controller, Get, Post, Body, Param, Delete, UseGuards, Request, Put } from '@nestjs/common';
import { CertificationsService } from './certifications.service';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { ApiBearerAuth, ApiConsumes, ApiOperation, ApiTags } from '@nestjs/swagger';
import { CreateCertificationDto } from './dto/create-certification.dto';
import { UnauthorizedException, Headers } from '@nestjs/common';

export class LmsCertificateDto {
  job_portal_id: string;
  certification_name: string;
  issuing_organization: string;
  issue_date: Date;
  expiration_date?: Date;
  credential_url: string;
}

@ApiTags('job-seeker-profile-certifications')
@Controller('profile/job-seeker/certifications')
export class CertificationsController {
  constructor(private readonly certificationsService: CertificationsService) { }

  @Get()
  @ApiBearerAuth('access-token')
  @UseGuards(new JwtAuthGuard(['job_seeker']))
  @ApiOperation({ summary: 'Get all certifications job seeker' })
  getCertifications(@Request() req) {
    return this.certificationsService.getCertifications(req.user);
  }

  @Get('/:certification_id')
  @ApiBearerAuth('access-token')
  @UseGuards(new JwtAuthGuard(['job_seeker']))
  @ApiOperation({ summary: 'Get a certification job seeker' })
  getCertification(@Param('certification_id') certification_id: string, @Request() req) {
    return this.certificationsService.getCertification(req.user, certification_id);
  }

  @Post()
  @ApiConsumes('multipart/form-data')
  @ApiConsumes('application/json')
  @ApiBearerAuth('access-token')
  @UseGuards(new JwtAuthGuard(['job_seeker']))
  @ApiOperation({ summary: 'Add certifications job seeker' })
  addCertifications(@Request() req, @Body() createCertificationDto: CreateCertificationDto) {
    return this.certificationsService.addCertifications(req.user, createCertificationDto);
  }

  @Put('/:certification_id')
  @ApiConsumes('multipart/form-data')
  @ApiConsumes('application/json')
  @ApiBearerAuth('access-token')
  @UseGuards(new JwtAuthGuard(['job_seeker']))
  @ApiOperation({ summary: 'Update certifications job seeker' })
  updateCertifications(@Param('certification_id') certification_id: string, @Request() req, @Body() createCertificationDto: CreateCertificationDto) {
    return this.certificationsService.updateCertifications(req.user, certification_id, createCertificationDto);
  }

  @Delete('/:certification_id')
  @ApiBearerAuth('access-token')
  @UseGuards(new JwtAuthGuard(['job_seeker']))
  @ApiOperation({ summary: 'Delete certifications job seeker' })
  deleteCertifications(@Param('certification_id') certification_id: string, @Request() req) {
    return this.certificationsService.deleteCertifications(req.user, certification_id);
  }

  @Post('/lms-webhook')
  @ApiOperation({ summary: 'Webhook to receive certificates from LMS' })
  async addCertificationFromLms(
    @Headers('x-api-key') apiKey: string,
    @Body() data: LmsCertificateDto,
  ) {
    if (apiKey !== process.env.LMS_INTEGRATION_API_KEY) {
      throw new UnauthorizedException('Invalid API Key');
    }
    return this.certificationsService.addCertificationFromLms(data);
  }
}
