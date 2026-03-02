import {
  Body,
  Controller,
  HttpCode,
  NotFoundException,
  Post,
  UnauthorizedException,
} from '@nestjs/common';
import { LoginService } from './login.service';
import { ApiConsumes, ApiOperation, ApiTags } from '@nestjs/swagger';
import { LoginJobSeekerDto } from './dto/loginJobSeeker.dto';
import { LoginCMSDto } from './dto/loginCMS.dto';
import { LoginGoogleDto } from './dto/loginGoogle.dto';

@ApiTags('auth-login')
@Controller('auth/login')
export class LoginController {
<<<<<<< HEAD
  constructor(private loginService: LoginService) { }
=======
  constructor(private loginService: LoginService) {}
>>>>>>> d7b606e12cb92238e67bccc72e4ad6563e2db204

  @Post('google')
  @ApiConsumes('multipart/form-data')
  @ApiConsumes('application/json')
  @ApiOperation({ summary: 'Login with Google' })
  @HttpCode(200)
  async loginGoogle(@Body() loginGoogleDto: LoginGoogleDto) {
    return this.loginService.loginGoogle(loginGoogleDto.credential);
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
<<<<<<< HEAD
    }
    // Bypass verification check for development since OTP emails fail
    // else if (user.verified === 'false') {
    //   throw new NotFoundException('User not found. Please register to create an account.');
    // }
=======
    } else if (user.verified === 'false') {
      throw new NotFoundException(
        'User not found. Please register to create an account.',
      );
    }
>>>>>>> d7b606e12cb92238e67bccc72e4ad6563e2db204
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
<<<<<<< HEAD
    }
    // Bypass verification check for development since OTP emails fail
    // else if (user.verified === 'false') {
    //   throw new NotFoundException('User not found. Please register to create an account.');
    // }
=======
    } else if (user.verified === 'false') {
      throw new NotFoundException(
        'User not found. Please register to create an account.',
      );
    }
>>>>>>> d7b606e12cb92238e67bccc72e4ad6563e2db204
    return this.loginService.login(user);
  }
}
