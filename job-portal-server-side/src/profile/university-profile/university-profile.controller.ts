import { Controller, Get, Post, Body, Put, UseInterceptors, UploadedFile, BadRequestException, UseGuards, Request } from '@nestjs/common';
import { UniversityProfileService } from './university-profile.service';
import { UpdateUniversityProfileDto } from './dto/update-university-profile.dto';
import { ApiBearerAuth, ApiConsumes, ApiOperation, ApiTags } from '@nestjs/swagger';
import { diskStorage } from 'multer';
import { FileInterceptor } from '@nestjs/platform-express';
import { extname } from 'path';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';

@ApiTags('university-profile')
@Controller('profile/university')
export class UniversityProfileController {
  constructor(private readonly universityProfileService: UniversityProfileService) { }

  @Get()
  @ApiBearerAuth('access-token')
  @UseGuards(new JwtAuthGuard(['university']))
  @ApiOperation({ summary: 'Get a university profile' })
  findOne(@Request() req) {
    return this.universityProfileService.findOne(req.user);
  }

  @Post()
  @ApiConsumes('application/json')
  @ApiConsumes('multipart/form-data')
  @ApiBearerAuth('access-token')
  @UseGuards(new JwtAuthGuard(['university']))
  @ApiOperation({ summary: 'Request new university' })
  @UseInterceptors(FileInterceptor('upload_logo', {
    storage: diskStorage({
      destination: './public/uploads/logo',
      filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
        const ext = extname(file.originalname);
        const filename = `logo-university-${uniqueSuffix}${ext}`;
        cb(null, filename);
      },
    }),
    fileFilter: (req, file, cb) => {
      if (!file.mimetype.match(/\/(jpg|jpeg|png|gif)$/)) {
        cb(new BadRequestException('Only image files are allowed!'), false);
      } else {
        cb(null, true);
      }
    },
  }))
  newUniversity(@Request() req, @Body() updateUniversityProfileDto: UpdateUniversityProfileDto, @UploadedFile() upload_logo?: Express.Multer.File) {
    const update = Object.fromEntries(
      Object.entries(updateUniversityProfileDto).filter(([key]) => !['upload_logo'].includes(key))
    );
    return this.universityProfileService.newUniversity(req.user, update, upload_logo);
  }

  @Put()
  @ApiConsumes('application/json')
  @ApiConsumes('multipart/form-data')
  @ApiBearerAuth('access-token')
  @UseGuards(new JwtAuthGuard(['university']))
  @ApiOperation({ summary: 'Update a university profile' })
  @UseInterceptors(FileInterceptor('upload_logo', {
    storage: diskStorage({
      destination: './public/uploads/logo',
      filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
        const ext = extname(file.originalname);
        const filename = `logo-university-${uniqueSuffix}${ext}`;
        cb(null, filename);
      },
    }),
    fileFilter: (req, file, cb) => {
      if (!file.mimetype.match(/\/(jpg|jpeg|png|gif)$/)) {
        cb(new BadRequestException('Only image files are allowed!'), false);
      } else {
        cb(null, true);
      }
    },
  }))
  update(@Request() req, @Body() updateUniversityProfileDto: UpdateUniversityProfileDto, @UploadedFile() upload_logo?: Express.Multer.File) {
    const update = Object.fromEntries(
      Object.entries(updateUniversityProfileDto).filter(([key]) => !['upload_logo'].includes(key))
    );
    return this.universityProfileService.update(req.user, update, upload_logo);
  }
}
