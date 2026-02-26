"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ContentController = void 0;
const common_1 = require("@nestjs/common");
const content_service_1 = require("./content.service");
const swagger_1 = require("@nestjs/swagger");
const update_about_us_dto_1 = require("./dto/update-about-us.dto");
const update_privacy_policy_dto_1 = require("./dto/update-privacy-policy.dto");
const create_event_news_dto_1 = require("./dto/create-event-news.dto");
const jwt_auth_guard_1 = require("../auth/jwt-auth.guard");
const platform_express_1 = require("@nestjs/platform-express");
const multer_1 = require("multer");
const path_1 = require("path");
let ContentController = class ContentController {
    constructor(contentService) {
        this.contentService = contentService;
    }
    async getAboutUs() {
        return this.contentService.getAboutUs();
    }
    async updateAboutUs(updateAboutUsDto) {
        return this.contentService.updateAboutUs(updateAboutUsDto.content);
    }
    async getPrivacyPolicy() {
        return this.contentService.getPrivacyPolicy();
    }
    async updatePrivacyPolicy(updatePrivacyPolicyDto) {
        return this.contentService.updatePrivacyPolicy(updatePrivacyPolicyDto.content);
    }
    async findAllEventNews(category, page, pageSize, search, sortBy, sortOrder) {
        return this.contentService.findAllEventNews({ category, page, pageSize, search, sortBy, sortOrder });
    }
    async getEventNewsById(page_id) {
        return this.contentService.getEventNewsById(page_id);
    }
    async getEventNews(slug) {
        return this.contentService.getEventNewsBySlug(slug);
    }
    async createEventNews(createEventNewsDto, upload_image) {
        const createDto = Object.fromEntries(Object.entries(createEventNewsDto).filter(([key]) => !['upload_image'].includes(key)));
        return this.contentService.createEventNews(createDto, upload_image);
    }
    async updateEventNews(page_id, createEventNewsDto, upload_image) {
        const updateDto = Object.fromEntries(Object.entries(createEventNewsDto).filter(([key]) => !['upload_image'].includes(key)));
        return this.contentService.updateEventNewsById(page_id, updateDto, upload_image);
    }
    async deleteEventNews(page_id) {
        return this.contentService.deleteEventNewsById(page_id);
    }
};
exports.ContentController = ContentController;
__decorate([
    (0, swagger_1.ApiTags)('content-about-us'),
    (0, common_1.Get)('about-us'),
    (0, swagger_1.ApiOperation)({ summary: 'Get about us content (public)' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], ContentController.prototype, "getAboutUs", null);
__decorate([
    (0, swagger_1.ApiTags)('content-about-us'),
    (0, common_1.Put)('about-us'),
    (0, swagger_1.ApiConsumes)('multipart/form-data'),
    (0, swagger_1.ApiConsumes)('application/json'),
    (0, swagger_1.ApiBearerAuth)('access-token'),
    (0, common_1.UseGuards)(new jwt_auth_guard_1.JwtAuthGuard(['superadmin'])),
    (0, swagger_1.ApiOperation)({ summary: 'Update about us content' }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [update_about_us_dto_1.UpdateAboutUsDto]),
    __metadata("design:returntype", Promise)
], ContentController.prototype, "updateAboutUs", null);
__decorate([
    (0, swagger_1.ApiTags)('content-private-policy'),
    (0, common_1.Get)('privacy-policy'),
    (0, swagger_1.ApiOperation)({ summary: 'Get privacy policy content (public)' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], ContentController.prototype, "getPrivacyPolicy", null);
__decorate([
    (0, swagger_1.ApiTags)('content-private-policy'),
    (0, common_1.Put)('privacy-policy'),
    (0, swagger_1.ApiConsumes)('multipart/form-data'),
    (0, swagger_1.ApiConsumes)('application/json'),
    (0, swagger_1.ApiBearerAuth)('access-token'),
    (0, common_1.UseGuards)(new jwt_auth_guard_1.JwtAuthGuard(['superadmin'])),
    (0, swagger_1.ApiOperation)({ summary: 'Update privacy policy content' }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [update_privacy_policy_dto_1.UpdatePrivacyPolicyDto]),
    __metadata("design:returntype", Promise)
], ContentController.prototype, "updatePrivacyPolicy", null);
__decorate([
    (0, swagger_1.ApiTags)('content-event-news'),
    (0, common_1.Get)('event-news'),
    (0, swagger_1.ApiOperation)({ summary: 'List all event & news' }),
    (0, swagger_1.ApiQuery)({ name: 'category', required: true, enum: ['all', 'event', 'news'], example: 'all', description: 'Category of event or news' }),
    (0, swagger_1.ApiQuery)({ name: 'page', required: false, type: Number, example: 1, description: 'Page number' }),
    (0, swagger_1.ApiQuery)({ name: 'pageSize', required: false, type: Number, example: 10, description: 'Number of items per page' }),
    (0, swagger_1.ApiQuery)({ name: 'search', required: false, type: String, example: '', description: 'Search term' }),
    (0, swagger_1.ApiQuery)({ name: 'sortBy', required: false, type: String, example: '', description: 'Field to sort by' }),
    (0, swagger_1.ApiQuery)({ name: 'sortOrder', required: false, enum: ['asc', 'desc'], example: '', description: 'Sort order' }),
    __param(0, (0, common_1.Query)('category')),
    __param(1, (0, common_1.Query)('page')),
    __param(2, (0, common_1.Query)('pageSize')),
    __param(3, (0, common_1.Query)('search')),
    __param(4, (0, common_1.Query)('sortBy')),
    __param(5, (0, common_1.Query)('sortOrder')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Number, Number, String, String, String]),
    __metadata("design:returntype", Promise)
], ContentController.prototype, "findAllEventNews", null);
__decorate([
    (0, swagger_1.ApiTags)('content-event-news'),
    (0, common_1.Get)('event-news/id/:page_id'),
    (0, swagger_1.ApiBearerAuth)('access-token'),
    (0, common_1.UseGuards)(new jwt_auth_guard_1.JwtAuthGuard(['superadmin'])),
    (0, swagger_1.ApiOperation)({ summary: 'Get event or news by page id' }),
    __param(0, (0, common_1.Param)('page_id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], ContentController.prototype, "getEventNewsById", null);
__decorate([
    (0, swagger_1.ApiTags)('content-event-news'),
    (0, common_1.Get)('event-news/:slug'),
    (0, swagger_1.ApiOperation)({ summary: 'Get event or news by slug (public)' }),
    __param(0, (0, common_1.Param)('slug')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], ContentController.prototype, "getEventNews", null);
__decorate([
    (0, swagger_1.ApiTags)('content-event-news'),
    (0, common_1.Post)('event-news'),
    (0, swagger_1.ApiConsumes)('multipart/form-data'),
    (0, swagger_1.ApiConsumes)('application/json'),
    (0, swagger_1.ApiBearerAuth)('access-token'),
    (0, common_1.UseGuards)(new jwt_auth_guard_1.JwtAuthGuard(['superadmin'])),
    (0, swagger_1.ApiOperation)({ summary: 'Create new event or news' }),
    (0, common_1.UseInterceptors)((0, platform_express_1.FileInterceptor)('upload_image', {
        storage: (0, multer_1.diskStorage)({
            destination: './public/uploads/content/images',
            filename: (req, file, cb) => {
                const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
                const ext = (0, path_1.extname)(file.originalname);
                const filename = `content-image-${uniqueSuffix}${ext}`;
                cb(null, filename);
            },
        }),
        fileFilter: (req, file, cb) => {
            if (!file.mimetype.match(/\/(jpg|jpeg|png)$/)) {
                cb(new common_1.BadRequestException('Only image files are allowed!'), false);
            }
            else {
                cb(null, true);
            }
        },
    })),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.UploadedFile)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_event_news_dto_1.CreateEventNewsDto, Object]),
    __metadata("design:returntype", Promise)
], ContentController.prototype, "createEventNews", null);
__decorate([
    (0, swagger_1.ApiTags)('content-event-news'),
    (0, common_1.Put)('event-news/:page_id'),
    (0, swagger_1.ApiConsumes)('multipart/form-data'),
    (0, swagger_1.ApiConsumes)('application/json'),
    (0, swagger_1.ApiBearerAuth)('access-token'),
    (0, common_1.UseGuards)(new jwt_auth_guard_1.JwtAuthGuard(['superadmin'])),
    (0, swagger_1.ApiOperation)({ summary: 'Update event or news by page id' }),
    (0, common_1.UseInterceptors)((0, platform_express_1.FileInterceptor)('upload_image', {
        storage: (0, multer_1.diskStorage)({
            destination: './public/uploads/content/images',
            filename: (req, file, cb) => {
                const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
                const ext = (0, path_1.extname)(file.originalname);
                const filename = `content-image-${uniqueSuffix}${ext}`;
                cb(null, filename);
            },
        }),
        fileFilter: (req, file, cb) => {
            if (!file.mimetype.match(/\/(jpg|jpeg|png)$/)) {
                cb(new common_1.BadRequestException('Only image files are allowed!'), false);
            }
            else {
                cb(null, true);
            }
        },
    })),
    __param(0, (0, common_1.Param)('page_id')),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.UploadedFile)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, create_event_news_dto_1.CreateEventNewsDto, Object]),
    __metadata("design:returntype", Promise)
], ContentController.prototype, "updateEventNews", null);
__decorate([
    (0, swagger_1.ApiTags)('content-event-news'),
    (0, common_1.Delete)('event-news/:page_id'),
    (0, swagger_1.ApiBearerAuth)('access-token'),
    (0, common_1.UseGuards)(new jwt_auth_guard_1.JwtAuthGuard(['superadmin'])),
    (0, swagger_1.ApiOperation)({ summary: 'Delete event or news by page id' }),
    __param(0, (0, common_1.Param)('page_id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], ContentController.prototype, "deleteEventNews", null);
exports.ContentController = ContentController = __decorate([
    (0, common_1.Controller)('content'),
    __metadata("design:paramtypes", [content_service_1.ContentService])
], ContentController);
//# sourceMappingURL=content.controller.js.map