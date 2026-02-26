import { BadRequestException, Body, Controller, Delete, Get, Param, Post, Put, Query, UploadedFile, UseGuards, UseInterceptors } from '@nestjs/common';
import { ContentService } from './content.service';
import { ApiBearerAuth, ApiConsumes, ApiOperation, ApiQuery, ApiTags } from '@nestjs/swagger';
import { UpdateAboutUsDto } from './dto/update-about-us.dto';
import { UpdatePrivacyPolicyDto } from './dto/update-privacy-policy.dto';
import { CreateEventNewsDto } from './dto/create-event-news.dto';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';

@Controller('content')
export class ContentController {
  constructor(private readonly contentService: ContentService) { }

  @ApiTags('content-about-us')
  @Get('about-us')
  @ApiOperation({ summary: 'Get about us content (public)' })
  async getAboutUs() {
    return this.contentService.getAboutUs();
  }

  @ApiTags('content-about-us')
  @Put('about-us')
  @ApiConsumes('multipart/form-data')
  @ApiConsumes('application/json')
  @ApiBearerAuth('access-token')
  @UseGuards(new JwtAuthGuard(['superadmin']))
  @ApiOperation({ summary: 'Update about us content' })
  async updateAboutUs(@Body() updateAboutUsDto: UpdateAboutUsDto) {
    return this.contentService.updateAboutUs(updateAboutUsDto.content);
  }

  @ApiTags('content-private-policy')
  @Get('privacy-policy')
  @ApiOperation({ summary: 'Get privacy policy content (public)' })
  async getPrivacyPolicy() {
    return this.contentService.getPrivacyPolicy();
  }

  @ApiTags('content-private-policy')
  @Put('privacy-policy')
  @ApiConsumes('multipart/form-data')
  @ApiConsumes('application/json')
  @ApiBearerAuth('access-token')
  @UseGuards(new JwtAuthGuard(['superadmin']))
  @ApiOperation({ summary: 'Update privacy policy content' })
  async updatePrivacyPolicy(@Body() updatePrivacyPolicyDto: UpdatePrivacyPolicyDto) {
    return this.contentService.updatePrivacyPolicy(updatePrivacyPolicyDto.content);
  }

  @ApiTags('content-event-news')
  @Get('event-news')
  @ApiOperation({ summary: 'List all event & news' })
  @ApiQuery({ name: 'category', required: true, enum: ['all', 'event', 'news'], example: 'all', description: 'Category of event or news' })
  @ApiQuery({ name: 'page', required: false, type: Number, example: 1, description: 'Page number' })
  @ApiQuery({ name: 'pageSize', required: false, type: Number, example: 10, description: 'Number of items per page' })
  @ApiQuery({ name: 'search', required: false, type: String, example: '', description: 'Search term' })
  @ApiQuery({ name: 'sortBy', required: false, type: String, example: '', description: 'Field to sort by' })
  @ApiQuery({ name: 'sortOrder', required: false, enum: ['asc', 'desc'], example: '', description: 'Sort order' })
  async findAllEventNews(
    @Query('category') category: 'all' | 'event' | 'news',
    @Query('page') page?: number,
    @Query('pageSize') pageSize?: number,
    @Query('search') search?: string,
    @Query('sortBy') sortBy?: string,
    @Query('sortOrder') sortOrder?: 'asc' | 'desc'
  ) {
    return this.contentService.findAllEventNews({ category, page, pageSize, search, sortBy, sortOrder });
  }

  @ApiTags('content-event-news')
  @Get('event-news/id/:page_id')
  @ApiBearerAuth('access-token')
  @UseGuards(new JwtAuthGuard(['superadmin']))
  @ApiOperation({ summary: 'Get event or news by page id' })
  async getEventNewsById(@Param('page_id') page_id: string) {
    return this.contentService.getEventNewsById(page_id);
  }

  @ApiTags('content-event-news')
  @Get('event-news/:slug')
  @ApiOperation({ summary: 'Get event or news by slug (public)' })
  async getEventNews(@Param('slug') slug: string) {
    return this.contentService.getEventNewsBySlug(slug);
  }

  @ApiTags('content-event-news')
  @Post('event-news')
  @ApiConsumes('multipart/form-data')
  @ApiConsumes('application/json')
  @ApiBearerAuth('access-token')
  @UseGuards(new JwtAuthGuard(['superadmin']))
  @ApiOperation({ summary: 'Create new event or news' })
  @UseInterceptors(FileInterceptor('upload_image', {
    storage: diskStorage({
      destination: './public/uploads/content/images',
      filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
        const ext = extname(file.originalname);
        const filename = `content-image-${uniqueSuffix}${ext}`;
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
  async createEventNews(@Body() createEventNewsDto: CreateEventNewsDto, @UploadedFile() upload_image?: Express.Multer.File) {
    const createDto = Object.fromEntries(
      Object.entries(createEventNewsDto).filter(([key]) => !['upload_image'].includes(key))
    );
    return this.contentService.createEventNews(createDto, upload_image);
  }

  @ApiTags('content-event-news')
  @Put('event-news/:page_id')
  @ApiConsumes('multipart/form-data')
  @ApiConsumes('application/json')
  @ApiBearerAuth('access-token')
  @UseGuards(new JwtAuthGuard(['superadmin']))
  @ApiOperation({ summary: 'Update event or news by page id' })
  @UseInterceptors(FileInterceptor('upload_image', {
    storage: diskStorage({
      destination: './public/uploads/content/images',
      filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
        const ext = extname(file.originalname);
        const filename = `content-image-${uniqueSuffix}${ext}`;
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
  async updateEventNews(@Param('page_id') page_id: string, @Body() createEventNewsDto: CreateEventNewsDto, @UploadedFile() upload_image?: Express.Multer.File) {
    const updateDto = Object.fromEntries(
      Object.entries(createEventNewsDto).filter(([key]) => !['upload_image'].includes(key))
    );
    return this.contentService.updateEventNewsById(page_id, updateDto, upload_image);
  }

  @ApiTags('content-event-news')
  @Delete('event-news/:page_id')
  @ApiBearerAuth('access-token')
  @UseGuards(new JwtAuthGuard(['superadmin']))
  @ApiOperation({ summary: 'Delete event or news by page id' })
  async deleteEventNews(@Param('page_id') page_id: string) {
    return this.contentService.deleteEventNewsById(page_id);
  }
}
