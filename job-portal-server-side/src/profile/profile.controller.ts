import {
  Controller,
  Post,
  Body,
  UseGuards,
  Request,
  Get,
  UploadedFile,
  UseInterceptors,
  BadRequestException,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ProfileService } from './profile.service';
import {
  ApiBearerAuth,
  ApiConsumes,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { ChangePasswordDto } from './dto/change-password.dto';
import { ChangeEmailDto } from './dto/change-email.dto';
import { VerifyChangeEmailDto } from './dto/verify-change-email.dto';

@ApiTags('profile')
@Controller('profile')
export class ProfileController {
  constructor(private readonly profileService: ProfileService) {}

  @Get('my')
  @ApiBearerAuth('access-token')
  @ApiOperation({ summary: 'Get user profile' })
  @UseGuards(JwtAuthGuard)
  async user(@Request() req) {
    return this.profileService.getUser(req.user);
  }

  @Post('change-password')
  @ApiConsumes('multipart/form-data')
  @ApiConsumes('application/json')
  @ApiBearerAuth('access-token')
  @ApiOperation({ summary: 'Change user password' })
  @UseGuards(JwtAuthGuard)
  async changePassword(
    @Request() req,
    @Body() changePasswordDto: ChangePasswordDto,
  ) {
    return this.profileService.changePassword(req.user, changePasswordDto);
  }

  @Post('change-email')
  @ApiConsumes('multipart/form-data')
  @ApiConsumes('application/json')
  @ApiBearerAuth('access-token')
  @ApiOperation({ summary: 'Change user email' })
  @UseGuards(JwtAuthGuard)
  async changeEmail(@Request() req, @Body() changeEmailDto: ChangeEmailDto) {
    return this.profileService.changeEmail(req.user, changeEmailDto);
  }

  @Post('verify-change-email')
  @ApiConsumes('multipart/form-data')
  @ApiConsumes('application/json')
  @ApiBearerAuth('access-token')
  @ApiOperation({ summary: 'Verify change email' })
  @UseGuards(JwtAuthGuard)
  async verifyChangeEmail(
    @Request() req,
    @Body() verifyChangeEmailDto: VerifyChangeEmailDto,
  ) {
    return this.profileService.verifyChangeEmail(
      req.user,
      verifyChangeEmailDto,
    );
  }

  @Get('profile-picture')
  @ApiBearerAuth('access-token')
  @ApiOperation({ summary: 'Get user profile picture' })
  @UseGuards(JwtAuthGuard)
  async profilePicture(@Request() req) {
    return this.profileService.getProfilePicture(req.user);
  }

  @Post('cv-autofill')
  @ApiConsumes('multipart/form-data')
  @ApiBearerAuth('access-token')
  @ApiOperation({ summary: 'Auto-fill profile from PDF CV' })
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(FileInterceptor('file'))
  async cvAutofill(@Request() req, @UploadedFile() file: Express.Multer.File) {
    if (!file) {
      throw new BadRequestException('CV file is required');
    }
    return this.profileService.cvAutofill(req.user, file);
  }
}
