import { Controller, Get, Post, Body, Param, Delete, UseGuards, Request, Put } from '@nestjs/common';
import { LanguagesService } from './languages.service';
import { CreateLanguageDto } from './dto/create-language.dto';
import { UpdateLanguageDto } from './dto/update-language.dto';
import { ApiBearerAuth, ApiConsumes, ApiOperation, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';

@ApiTags('job-seeker-profile-languages')
@Controller('profile/job-seeker/languages')
export class LanguagesController {
  constructor(private readonly languagesService: LanguagesService) { }
  @Get()
  @ApiBearerAuth('access-token')
  @UseGuards(new JwtAuthGuard(['job_seeker']))
  @ApiOperation({ summary: 'Get all languages job seeker' })
  getLanguages(@Request() req) {
    return this.languagesService.getLanguages(req.user);
  }

  @Get('/:language_id')
  @ApiBearerAuth('access-token')
  @UseGuards(new JwtAuthGuard(['job_seeker']))
  @ApiOperation({ summary: 'Get language job seeker' })
  getLanguage(@Param('language_id') language_id: string, @Request() req) {
    return this.languagesService.getLanguage(req.user, language_id);
  }

  @Post()
  @ApiConsumes('multipart/form-data')
  @ApiConsumes('application/json')
  @ApiBearerAuth('access-token')
  @UseGuards(new JwtAuthGuard(['job_seeker']))
  @ApiOperation({ summary: 'Add languages job seeker' })
  addLanguages(@Request() req, @Body() createLanguageDto: CreateLanguageDto) {
    return this.languagesService.addLanguages(req.user, createLanguageDto);
  }

  @Put('/:language_id')
  @ApiConsumes('multipart/form-data')
  @ApiConsumes('application/json')
  @ApiBearerAuth('access-token')
  @UseGuards(new JwtAuthGuard(['job_seeker']))
  @ApiOperation({ summary: 'Update languages job seeker' })
  updateLanguages(@Param('language_id') language_id: string, @Request() req, @Body() updateLanguageDto: UpdateLanguageDto) {
    return this.languagesService.updateLanguages(req.user, language_id, updateLanguageDto);
  }

  @Delete('/:language_id')
  @ApiBearerAuth('access-token')
  @UseGuards(new JwtAuthGuard(['job_seeker']))
  @ApiOperation({ summary: 'Delete language job seeker' })
  deleteLanguages(@Param('language_id') language_id: string, @Request() req) {
    return this.languagesService.deleteLanguages(req.user, language_id);
  }
}
