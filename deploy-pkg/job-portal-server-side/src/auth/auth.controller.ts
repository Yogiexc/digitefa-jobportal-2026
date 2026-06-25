import { Controller, Get, Request, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { JwtAuthGuard } from './jwt-auth.guard';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) { }

  @Get('user')
  @ApiBearerAuth('access-token')
  @ApiOperation({ summary: 'Validate login token' })
  @UseGuards(JwtAuthGuard)
  async user(@Request() req) {
    return this.authService.getUser(req.user);
  }
}