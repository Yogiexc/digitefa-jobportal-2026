import { Controller, Get, Body, Post, Put, UseInterceptors, UploadedFile, BadRequestException, UseGuards, Request } from '@nestjs/common';
import { CompanyProfileService } from './company-profile.service';
import { UpdateCompanyProfileDto } from './dto/update-company-profile.dto';
import { ApiBearerAuth, ApiConsumes, ApiOperation, ApiTags } from '@nestjs/swagger';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';

@ApiTags('company-profile')
@Controller('profile/company')
export class CompanyProfileController {
  constructor(private readonly companyProfileService: CompanyProfileService) { }
  @Get()
  @ApiBearerAuth('access-token')
  @UseGuards(new JwtAuthGuard(['company']))
  @ApiOperation({ summary: 'Get a company profile' })
  findOne(@Request() req) {
    return this.companyProfileService.findOne(req.user);
  }

  @Post()
  @ApiConsumes('application/json')
  @ApiConsumes('multipart/form-data')
  @ApiBearerAuth('access-token')
  @UseGuards(new JwtAuthGuard(['company']))
  @ApiOperation({ summary: 'Request new company' })
  @UseInterceptors(FileInterceptor('upload_logo', {
    storage: diskStorage({
      destination: './public/uploads/logo',
      filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
        const ext = extname(file.originalname);
        const filename = `logo-company-${uniqueSuffix}${ext}`;
        cb(null, filename);
      },
    }),
    fileFilter: (req, file, cb) => {
      if (!file.mimetype.match(/\/(jpg|jpeg|png)$/)) {
        cb(new BadRequestException('Only image files are allowed!'), false);
      } else {
        cb(null, true);
      }
    },
  }))
  newCompany(@Request() req, @Body() updateCompanyProfileDto: UpdateCompanyProfileDto, @UploadedFile() upload_logo?: Express.Multer.File) {
    const update = Object.fromEntries(
      Object.entries(updateCompanyProfileDto).filter(([key]) => !['upload_logo'].includes(key))
    );
    return this.companyProfileService.newCompany(req.user, update, upload_logo);
  }

  @Put()
  @ApiConsumes('application/json')
  @ApiConsumes('multipart/form-data')
  @ApiBearerAuth('access-token')
  @UseGuards(new JwtAuthGuard(['company']))
  @ApiOperation({ summary: 'Update a company profile' })
  @UseInterceptors(FileInterceptor('upload_logo', {
    storage: diskStorage({
      destination: './public/uploads/logo',
      filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
        const ext = extname(file.originalname);
        const filename = `logo-company-${uniqueSuffix}${ext}`;
        cb(null, filename);
      },
    }),
    fileFilter: (req, file, cb) => {
      if (!file.mimetype.match(/\/(jpg|jpeg|png)$/)) {
        cb(new BadRequestException('Only image files are allowed!'), false);
      } else {
        cb(null, true);
      }
    },
  }))
  update(@Request() req, @Body() updateCompanyProfileDto: UpdateCompanyProfileDto, @UploadedFile() upload_logo?: Express.Multer.File) {
    const update = Object.fromEntries(
      Object.entries(updateCompanyProfileDto).filter(([key]) => !['upload_logo'].includes(key))
    );
    return this.companyProfileService.update(req.user, update, upload_logo);
  }
}
