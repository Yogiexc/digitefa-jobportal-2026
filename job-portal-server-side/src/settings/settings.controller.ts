import { Controller, Post, Body, Get, UseGuards } from '@nestjs/common';
import { SettingsService } from './settings.service';
import { ChangeSecureLog } from './dto/changeSecureLog.dto';
import { ApiBearerAuth, ApiConsumes, ApiOperation, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';

@ApiTags('settings')
@Controller('settings')
export class SettingsController {
  constructor(private readonly settingsService: SettingsService) { }

  @Post('secure-log')
  @ApiConsumes('multipart/form-data')
  @ApiConsumes('application/json')
  @ApiBearerAuth('access-token')
  @UseGuards(new JwtAuthGuard(['superadmin']))
  @ApiOperation({ summary: 'Change Secure Log' })
  changeSecureLog(@Body() changeSecureLog: ChangeSecureLog) {
    return this.settingsService.changeSecureLog(changeSecureLog);
  }

  @Get('secure-log')
  @ApiConsumes('multipart/form-data')
  @ApiConsumes('application/json')
  @ApiBearerAuth('access-token')
  @UseGuards(new JwtAuthGuard(['superadmin', 'university']))
  @ApiOperation({ summary: 'Get Secure Log' })
  getSecureLogStatus() {
    return this.settingsService.getSecureLogStatus();
  }
}
