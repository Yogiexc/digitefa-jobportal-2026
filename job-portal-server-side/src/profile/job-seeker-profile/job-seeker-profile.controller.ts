import { Controller, Get, Put, UseInterceptors, UploadedFile, BadRequestException, UseGuards, Request, Body, Post } from '@nestjs/common';
import { JobSeekerProfileService } from './job-seeker-profile.service';
import { ApiBearerAuth, ApiConsumes, ApiOperation, ApiTags } from '@nestjs/swagger';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { UpdatePersonalInfoDto } from './dto/update-personal-info.dto';
import { UpdatePersonalSummaryDto } from './dto/update-personal-summary.dto';
import { UpdateProfilePictureDto } from './dto/update-profile-picture.dto';
import { UpdateEducationDto } from './dto/update-education.dto';

@Controller('profile/job-seeker')
export class JobSeekerProfileController {
  constructor(private readonly jobSeekerProfileService: JobSeekerProfileService) { }

  @ApiTags('job-seeker-profile')
  @Get('personal-info')
  @ApiBearerAuth('access-token')
  @UseGuards(new JwtAuthGuard(['job_seeker']))
  @ApiOperation({ summary: 'Get a job seeker personal information' })
  async getPersonalInfo(@Request() req) {
    return this.jobSeekerProfileService.getPersonalInfo(req.user);
  }

  @ApiTags('job-seeker-profile')
  @ApiConsumes('application/json')
  @ApiConsumes('multipart/form-data')
  @Post('profile-picture')
  @ApiBearerAuth('access-token')
  @UseGuards(new JwtAuthGuard(['job_seeker']))
  @ApiOperation({ summary: 'Update a job seeker profile picture' })
  @UseInterceptors(FileInterceptor('profile_picture', {
    storage: diskStorage({
      destination: './public/uploads/profile-picture',
      filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
        const ext = extname(file.originalname);
        const filename = `profile-picture-${uniqueSuffix}${ext}`;
        cb(null, filename);
      },
    }),
    fileFilter: (req, file, cb) => {
      if (!file.mimetype.match(/\/(jpg|jpeg|png)$/)) {
        cb(new BadRequestException('Only image (jpg, jpeg, png) files are allowed!'), false);
      } else {
        cb(null, true);
      }
    },
  }))
  async updateProfilePicture(@Request() req, @Body() uploadProfilePictureDto: UpdateProfilePictureDto, @UploadedFile() profile_picture?: Express.Multer.File) {
    return this.jobSeekerProfileService.updateProfilePicture(req.user, profile_picture);
  }

  @ApiTags('job-seeker-profile')
  @Put('personal-info')
  @ApiConsumes('multipart/form-data')
  @ApiConsumes('application/json')
  @ApiBearerAuth('access-token')
  @UseGuards(new JwtAuthGuard(['job_seeker']))
  @ApiOperation({ summary: 'Update a job seeker personal information' })
  async updatePersonalInfo(@Request() req, @Body() updatePersonalInfoDto: UpdatePersonalInfoDto) {
    return this.jobSeekerProfileService.updatePersonalInfo(req.user, updatePersonalInfoDto);
  }

  @ApiTags('job-seeker-profile-personal-summary')
  @Get('personal-summary')
  @ApiConsumes('multipart/form-data')
  @ApiConsumes('application/json')
  @ApiBearerAuth('access-token')
  @UseGuards(new JwtAuthGuard(['job_seeker']))
  @ApiOperation({ summary: 'Get a job seeker personal summary' })
  async getPersonalSummary(@Request() req) {
    return this.jobSeekerProfileService.getPersonalSummary(req.user);
  }

  @ApiTags('job-seeker-profile-personal-summary')
  @Put('personal-summary')
  @ApiConsumes('multipart/form-data')
  @ApiConsumes('application/json')
  @ApiBearerAuth('access-token')
  @UseGuards(new JwtAuthGuard(['job_seeker']))
  @ApiOperation({ summary: 'Update a job seeker personal summary' })
  async updatePersonalSummary(@Request() req, @Body() updatePersonalSummaryDto: UpdatePersonalSummaryDto) {
    return this.jobSeekerProfileService.updatePersonalSummary(req.user, updatePersonalSummaryDto);
  }

  @ApiTags('job-seeker-profile-education')
  @Get('education')
  @ApiConsumes('multipart/form-data')
  @ApiConsumes('application/json')
  @ApiBearerAuth('access-token')
  @UseGuards(new JwtAuthGuard(['job_seeker']))
  @ApiOperation({ summary: 'Get education job seeker' })
  async getEducation(@Request() req) {
    return this.jobSeekerProfileService.getEducation(req.user);
  }

  @ApiTags('job-seeker-profile-education')
  @Put('education')
  @ApiConsumes('multipart/form-data')
  @ApiConsumes('application/json')
  @ApiBearerAuth('access-token')
  @UseGuards(new JwtAuthGuard(['job_seeker']))
  @ApiOperation({ summary: 'Update education job seeker' })
  async updateEducation(@Request() req, @Body() updateEducationDto: UpdateEducationDto) {
    return this.jobSeekerProfileService.updateEducation(req.user, updateEducationDto);
  }
}
