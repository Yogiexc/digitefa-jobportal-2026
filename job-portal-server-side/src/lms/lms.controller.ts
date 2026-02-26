import { Request } from 'express';
import {
  Controller,
  Get,
  Post,
  Body,
  Req,
  UseGuards,
  InternalServerErrorException,
  UnauthorizedException,
  ForbiddenException,
} from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { LmsService } from './lms.service';
import { LinkLmsAccountDto } from './dto/link-lms-account.dto';
import { AuthGuard } from '@nestjs/passport';
import { ApiKeyGuard } from '../auth/guards/api-key.guard';
import { ValidateJobPortalAccountDto } from './dto/validate-job-portal-account.dto';
import { UnlinkJobPortalAccountDto } from './dto/unlink-job-portal-account.dto';
import { ApiHeader } from '@nestjs/swagger';

interface JwtPayload {
  sub: string; 
  role: string;
  job_seeker_id?: string;
  university_id?: string;
  company_id?: string;
  admin_id?: string;
  iat?: number;
  exp?: number;
}

@ApiTags('lms')
@Controller('lms')
export class LmsController {
  constructor(private readonly lmsService: LmsService) {}

  @Post('unlink-from-lms')
  @UseGuards(ApiKeyGuard)
  @ApiOperation({ summary: 'Unlink Job Portal account by command from LMS (Server-to-Server)' })
  @ApiHeader({ name: 'X-API-KEY', description: 'API Key for server-to-server communication' })
  async unlinkByLmsCommand(@Body() body: UnlinkJobPortalAccountDto) {
    await this.lmsService.unlinkFromLmsCommand(body);
    return {
      message: 'Job Portal account unlinked successfully.',
    };
  }

  @Post('validate-and-link-from-lms')
  @UseGuards(ApiKeyGuard) 
  @ApiOperation({
    summary:
      'Validate Job Portal credentials and link from LMS (Server-to-Server)',
  })
  @ApiHeader({
    name: 'X-API-KEY',
    description: 'API Key for server-to-server communication',
  })
  async validateAndLinkFromLms(@Body() body: ValidateJobPortalAccountDto) {
    const result = await this.lmsService.validateAndLinkJobPortalAccount(body);
    return {
      message: 'Job Portal account validated and linked successfully.',
      data: result,
    };
  }

  @Get('jobs')
  @ApiOperation({ summary: 'List all jobs' })
  getJobs() {
    return this.lmsService.getJobs();
  }

  @Post('link-account')
  @UseGuards(AuthGuard('jwt'))
  @ApiOperation({ summary: 'Link LMS account to job seeker' })
  async linkAccount(@Body() body: LinkLmsAccountDto, @Req() req: Request) {
    const { email, password } = body;
    const jwtPayload = req.user as JwtPayload;

    console.log('[LmsController] JWT Payload from req.user:', jwtPayload);

    if (!jwtPayload) {
      console.error(
        '[LmsController] Critical: req.user (JWT Payload) is undefined after AuthGuard.',
      );
      throw new UnauthorizedException(
        'Authentication token is invalid or missing.',
      );
    }

    if (jwtPayload.role !== 'job_seeker') {
      console.warn(
        `[LmsController] Forbidden: User with role '${jwtPayload.role}' attempted to link LMS account.`,
      );
      throw new ForbiddenException(
        'This action is only allowed for job seekers.',
      );
    }

    const jobSeekerId = jwtPayload.job_seeker_id;

    if (!jobSeekerId) {
      console.error(
        '[LmsController] Critical: job_seeker_id is missing in JWT payload for job_seeker role.',
      );
      throw new InternalServerErrorException(
        'Job Seeker ID not found in token. Please re-login.',
      );
    }

    console.log(
      `[LmsController] Attempting to validate LMS credentials for jobSeekerId: ${jobSeekerId}`,
    );

    const lmsUserResponse = await this.lmsService.validateLmsCredentials(
      email,
      password,
      jobSeekerId,
    );

    console.log(
      '[LmsController] LMS User response from Laravel:',
      lmsUserResponse,
    );

    if (
      !lmsUserResponse ||
      !lmsUserResponse.user ||
      typeof lmsUserResponse.user.id_user === 'undefined' ||
      lmsUserResponse.user.id_user === null
    ) {
      console.error(
        '[LmsController] Invalid LMS user data: `user` object or `user.id_user` missing/null from LMS response:',
        lmsUserResponse,
      );
      throw new InternalServerErrorException(
        'Failed to retrieve valid user ID from LMS.',
      );
    }

    const lmsUserId = String(lmsUserResponse.user.id_user);

    console.log(
      `[LmsController] Linking account: jobSeekerId=${jobSeekerId}, lmsUserId=${lmsUserId}`,
    );

    await this.lmsService.linkLmsAccount(jobSeekerId, lmsUserId);

    return { message: 'LMS account linked successfully.' };
  }

  @Post('unlink-account')
  @UseGuards(AuthGuard('jwt'))
  @ApiOperation({ summary: 'Unlink LMS account from job seeker' })
  async unlinkAccount(@Req() req: Request) {
    const jwtPayload = req.user as JwtPayload;

    console.log('[LmsController] JWT Payload from req.user:', jwtPayload);

    if (!jwtPayload) {
      console.error(
        '[LmsController] Critical: req.user (JWT Payload) is undefined after AuthGuard.',
      );
      throw new UnauthorizedException(
        'Authentication token is invalid or missing.',
      );
    }

    if (jwtPayload.role !== 'job_seeker') {
      console.warn(
        `[LmsController] Forbidden: User with role '${jwtPayload.role}' attempted to unlink LMS account.`,
      );
      throw new ForbiddenException(
        'This action is only allowed for job seekers.',
      );
    }

    const jobSeekerId = jwtPayload.job_seeker_id;

    if (!jobSeekerId) {
      console.error(
        '[LmsController] Critical: job_seeker_id is missing in JWT payload for job_seeker role.',
      );
      throw new InternalServerErrorException(
        'Job Seeker ID not found in token. Please re-login.',
      );
    }

    console.log(
      `[LmsController] Attempting to unlink LMS account for jobSeekerId: ${jobSeekerId}`,
    );

    await this.lmsService.unlinkLmsAccount(jobSeekerId);

    return { message: 'LMS account unlinked successfully.' };
  }
}
