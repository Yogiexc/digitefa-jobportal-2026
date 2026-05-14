import {
  Controller,
  Post,
  Body,
  UseGuards,
  Request,
  Get,
  Delete,
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
  ApiResponse,
  ApiBody,
} from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { ChangePasswordDto } from './dto/change-password.dto';
import { ChangeEmailDto } from './dto/change-email.dto';
import { VerifyChangeEmailDto } from './dto/verify-change-email.dto';
import { ConfirmAutofillDto } from './dto/confirm-autofill.dto';

@ApiTags('profile')
@Controller('profile')
export class ProfileController {
  constructor(private readonly profileService: ProfileService) { }

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
  async cvAutofill(@Request() req, @UploadedFile() file: any) {
    if (!file) {
      throw new BadRequestException('CV file is required');
    }
    return this.profileService.cvAutofill(req.user, file);
  }

  @Post('cv-autofill-confirm')
  @ApiConsumes('application/json')
  @ApiBearerAuth('access-token')
  @ApiOperation({ summary: 'Confirm and save auto-filled profile data' })
  @ApiBody({ type: ConfirmAutofillDto })
  @ApiResponse({ status: 200, description: 'Parsing data berhasil diterima dan profil diupdate.' })
  @ApiResponse({ status: 400, description: 'Bad Request, Parsed data is required atau ada format yang salah.' })
  @ApiResponse({ status: 401, description: 'Unauthorized, Token JWT tidak valid atau tidak diberikan.' })
  @UseGuards(JwtAuthGuard)
  async cvAutofillConfirm(@Request() req, @Body() body: any) {
    const fs = require('fs');
    try {
      if (!body) throw new BadRequestException('Body is required');
      if (!body.parsedData) throw new BadRequestException('Parsed data is required: ' + JSON.stringify(body));
      return await this.profileService.cvAutofillConfirm(req.user, body.parsedData);
    } catch (e) {
      const err = e.response ? e.response : e.message;
      const path = require('path');
      try { 
        const logPath = path.join(process.cwd(), 'confirm_error.log');
        fs.writeFileSync(logPath, JSON.stringify({ err, body }, null, 2)); 
      } catch (fsErr) { }
      throw e;
    }
  }

  @Delete('education')
  @ApiBearerAuth('access-token')
  @ApiOperation({ summary: 'Delete user education' })
  @UseGuards(JwtAuthGuard)
  async deleteEducation(@Request() req) {
    return this.profileService.deleteEducation(req.user);
  }
}
