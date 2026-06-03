import {
  Body,
  Controller,
  HttpCode,
  NotFoundException,
  Post,
  UnauthorizedException,
  ForbiddenException,
} from '@nestjs/common';
import { LoginService } from './login.service';
import { ApiConsumes, ApiOperation, ApiTags } from '@nestjs/swagger';
import { LoginJobSeekerDto } from './dto/loginJobSeeker.dto';
import { LoginCMSDto } from './dto/loginCMS.dto';
import { LoginGoogleDto } from './dto/loginGoogle.dto';
import { SsoLmsDto } from './dto/ssoLms.dto';

@ApiTags('auth-login')
@Controller('auth/login')
export class LoginController {
  constructor(private loginService: LoginService) { }

  @Post('google')
  @ApiConsumes('multipart/form-data')
  @ApiConsumes('application/json')
  @ApiOperation({ summary: 'Login with Google' })
  @HttpCode(200)
  async loginGoogle(@Body() loginGoogleDto: LoginGoogleDto) {
    return this.loginService.loginGoogle(loginGoogleDto.credential);
  }

  @Post('sso-lms')
  @ApiConsumes('application/json')
  @ApiOperation({ summary: 'Login or Auto-Register from LMS via SSO' })
  @HttpCode(200)
  async ssoLms(@Body() ssoLmsDto: SsoLmsDto) {
    return this.loginService.ssoLms(ssoLmsDto);
  }

  @Post('job-seeker')
  @ApiConsumes('multipart/form-data')
  @ApiConsumes('application/json')
  @ApiOperation({ summary: 'Login as a job seeker' })
  @HttpCode(200)
  async loginJobSeeker(@Body() loginJobSeekerDto: LoginJobSeekerDto) {
    const user = await this.loginService.validateJobSeeker(loginJobSeekerDto);
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }
    if (user.verified === 'false') {
      throw new ForbiddenException('Your account is not verified. Please verify your OTP to login.');
    }
    return this.loginService.login(user);
  }

  @Post('cms')
  @ApiConsumes('multipart/form-data')
  @ApiConsumes('application/json')
  @ApiOperation({ summary: 'Login CMS' })
  @HttpCode(200)
  async loginCMS(@Body() loginCMSDto: LoginCMSDto) {
    const user = await this.loginService.validateCMS(loginCMSDto);
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }
    if (user.verified === 'false') {
      throw new ForbiddenException('Your account is not verified. Please verify your OTP to login.');
    }
    return this.loginService.login(user);
  }
}
