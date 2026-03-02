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
exports.ApplicantsController = void 0;
const common_1 = require("@nestjs/common");
const applicants_service_1 = require("./applicants.service");
const swagger_1 = require("@nestjs/swagger");
const jwt_auth_guard_1 = require("../auth/jwt-auth.guard");
const apply_job_dto_1 = require("./dto/apply-job.dto");
const platform_express_1 = require("@nestjs/platform-express");
const multer_1 = require("multer");
const path_1 = require("path");
const api_key_guard_1 = require("../auth/guards/api-key.guard");
const find_all_applied_jobs_for_lms_dto_1 = require("./dto/find-all-applied-jobs-for-lms.dto");
let ApplicantsController = class ApplicantsController {
    constructor(applicantsService) {
        this.applicantsService = applicantsService;
    }
    async applyJob(req, job_id, applyJobDto, resume) {
        const applyJob = Object.fromEntries(Object.entries(applyJobDto).filter(([key]) => !['upload_resume'].includes(key)));
        return this.applicantsService.applyJob(req.user, job_id, applyJob, resume);
    }
    findAllJobsApplied(req, page, pageSize, search, sortBy, sortOrder, status) {
        return this.applicantsService.findAllJobsApplied(req.user, {
            page,
            pageSize,
            search,
            sortBy,
            sortOrder,
            status,
        });
    }
    detailJobsApplied(req, application_id) {
        return this.applicantsService.detailJobsApplied(req.user, application_id);
    }
    async exportAllJobsAppliedHistory(job_seeker_id, format, res) {
        return this.applicantsService.exportAllJobsAppliedHistory(job_seeker_id, format, res);
    }
    async findAllJobsAppliedHistory(job_seeker_id, page, pageSize, search, sortBy, sortOrder, status) {
        return this.applicantsService.findAllJobsAppliedHistory(job_seeker_id, {
            page,
            pageSize,
            search,
            sortBy,
            sortOrder,
            status,
        });
    }
    findAllJobsAppliedForLms(job_seeker_id, queryOptions) {
        return this.applicantsService.findAllJobsAppliedForLms(job_seeker_id, queryOptions);
    }
};
exports.ApplicantsController = ApplicantsController;
__decorate([
    (0, swagger_1.ApiTags)('job-seeker-apply-jobs'),
    (0, common_1.Post)('apply-jobs/:job_id'),
    (0, swagger_1.ApiConsumes)('application/json'),
    (0, swagger_1.ApiConsumes)('multipart/form-data'),
    (0, swagger_1.ApiBearerAuth)('access-token'),
    (0, common_1.UseGuards)(new jwt_auth_guard_1.JwtAuthGuard(['job_seeker'])),
    (0, swagger_1.ApiOperation)({ summary: 'Apply Jobs for job seekers' }),
    (0, common_1.UseInterceptors)((0, platform_express_1.FileInterceptor)('upload_resume', {
        storage: (0, multer_1.diskStorage)({
            destination: './public/uploads/resume',
            filename: (req, file, cb) => {
                const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
                const ext = (0, path_1.extname)(file.originalname);
                const filename = `resume-${uniqueSuffix}${ext}`;
                cb(null, filename);
            },
        }),
        fileFilter: (req, file, cb) => {
            if (!file.mimetype.match(/\/(jpg|jpeg|png|pdf)$/)) {
                cb(new common_1.BadRequestException('Only image (jpg, jpeg, png) and PDF files are allowed!'), false);
            }
            else {
                cb(null, true);
            }
        },
    })),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Param)('job_id')),
    __param(2, (0, common_1.Body)()),
    __param(3, (0, common_1.UploadedFile)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, apply_job_dto_1.ApplyJobDto, Object]),
    __metadata("design:returntype", Promise)
], ApplicantsController.prototype, "applyJob", null);
__decorate([
    (0, swagger_1.ApiTags)('job-seeker-applied-jobs'),
    (0, common_1.Get)('applied-jobs'),
    (0, swagger_1.ApiBearerAuth)('access-token'),
    (0, common_1.UseGuards)(new jwt_auth_guard_1.JwtAuthGuard(['job_seeker'])),
    (0, swagger_1.ApiOperation)({ summary: 'List all jobs applied by job seeker' }),
    (0, swagger_1.ApiQuery)({
        name: 'page',
        required: false,
        type: Number,
        example: 1,
        description: 'Page number',
    }),
    (0, swagger_1.ApiQuery)({
        name: 'pageSize',
        required: false,
        type: Number,
        example: 10,
        description: 'Number of items per page',
    }),
    (0, swagger_1.ApiQuery)({
        name: 'search',
        required: false,
        type: String,
        example: '',
        description: 'Search term',
    }),
    (0, swagger_1.ApiQuery)({
        name: 'sortBy',
        required: false,
        type: String,
        example: '',
        description: 'Field to sort by',
    }),
    (0, swagger_1.ApiQuery)({
        name: 'sortOrder',
        required: false,
        enum: ['asc', 'desc'],
        example: 'desc',
        description: 'Sort order',
    }),
    (0, swagger_1.ApiQuery)({
        name: 'status',
        required: false,
        type: String,
        example: 'applied',
        description: 'Filter by status',
    }),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Query)('page')),
    __param(2, (0, common_1.Query)('pageSize')),
    __param(3, (0, common_1.Query)('search')),
    __param(4, (0, common_1.Query)('sortBy')),
    __param(5, (0, common_1.Query)('sortOrder')),
    __param(6, (0, common_1.Query)('status')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Number, Number, String, String, String, String]),
    __metadata("design:returntype", void 0)
], ApplicantsController.prototype, "findAllJobsApplied", null);
__decorate([
    (0, swagger_1.ApiTags)('job-seeker-applied-jobs'),
    (0, common_1.Get)('detail-applied-jobs:/application_id'),
    (0, swagger_1.ApiBearerAuth)('access-token'),
    (0, common_1.UseGuards)(new jwt_auth_guard_1.JwtAuthGuard(['job_seeker'])),
    (0, swagger_1.ApiOperation)({ summary: 'Detail jobs applied by job seeker' }),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Param)('application_id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", void 0)
], ApplicantsController.prototype, "detailJobsApplied", null);
__decorate([
    (0, swagger_1.ApiTags)('job-seekers'),
    (0, swagger_1.ApiTags)('student-management'),
    (0, common_1.Post)('applied-jobs/:job_seeker_id/export'),
    (0, swagger_1.ApiBearerAuth)('access-token'),
    (0, common_1.UseGuards)(new jwt_auth_guard_1.JwtAuthGuard(['superadmin', 'university'])),
    (0, swagger_1.ApiOperation)({
        summary: 'Export all jobs applied history by job seeker (company & superadmin)',
    }),
    (0, swagger_1.ApiQuery)({
        name: 'format',
        required: true,
        enum: ['csv', 'xlsx'],
        description: 'Export format',
    }),
    __param(0, (0, common_1.Param)('job_seeker_id')),
    __param(1, (0, common_1.Query)('format')),
    __param(2, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, Object]),
    __metadata("design:returntype", Promise)
], ApplicantsController.prototype, "exportAllJobsAppliedHistory", null);
__decorate([
    (0, swagger_1.ApiTags)('job-seekers'),
    (0, swagger_1.ApiTags)('student-management'),
    (0, common_1.Get)('applied-jobs/:job_seeker_id'),
    (0, swagger_1.ApiBearerAuth)('access-token'),
    (0, common_1.UseGuards)(new jwt_auth_guard_1.JwtAuthGuard(['superadmin', 'university'])),
    (0, swagger_1.ApiOperation)({
        summary: 'List all jobs applied by job seeker (company & superadmin)',
    }),
    (0, swagger_1.ApiQuery)({
        name: 'page',
        required: false,
        type: Number,
        example: 1,
        description: 'Page number',
    }),
    (0, swagger_1.ApiQuery)({
        name: 'pageSize',
        required: false,
        type: Number,
        example: 10,
        description: 'Number of items per page',
    }),
    (0, swagger_1.ApiQuery)({
        name: 'search',
        required: false,
        type: String,
        example: '',
        description: 'Search term',
    }),
    (0, swagger_1.ApiQuery)({
        name: 'sortBy',
        required: false,
        type: String,
        example: '',
        description: 'Field to sort by',
    }),
    (0, swagger_1.ApiQuery)({
        name: 'sortOrder',
        required: false,
        enum: ['asc', 'desc'],
        example: 'desc',
        description: 'Sort order',
    }),
    (0, swagger_1.ApiQuery)({
        name: 'status',
        required: false,
        type: String,
        example: 'applied',
        description: 'Filter by status',
    }),
    __param(0, (0, common_1.Param)('job_seeker_id')),
    __param(1, (0, common_1.Query)('page')),
    __param(2, (0, common_1.Query)('pageSize')),
    __param(3, (0, common_1.Query)('search')),
    __param(4, (0, common_1.Query)('sortBy')),
    __param(5, (0, common_1.Query)('sortOrder')),
    __param(6, (0, common_1.Query)('status')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Number, Number, String, String, String, String]),
    __metadata("design:returntype", Promise)
], ApplicantsController.prototype, "findAllJobsAppliedHistory", null);
__decorate([
    (0, swagger_1.ApiTags)('lms'),
    (0, common_1.Get)('lms/applied-jobs/:job_seeker_id'),
    (0, common_1.UseGuards)(api_key_guard_1.ApiKeyGuard),
    (0, swagger_1.ApiOperation)({
        summary: 'List ALL jobs applied by a job seeker (for LMS, no pagination)',
    }),
    (0, swagger_1.ApiHeader)({
        name: 'X-API-KEY',
        description: 'API Key for server-to-server communication',
    }),
    (0, swagger_1.ApiQuery)({ name: 'search', required: false, type: String }),
    (0, swagger_1.ApiQuery)({ name: 'sortBy', required: false, type: String }),
    (0, swagger_1.ApiQuery)({ name: 'sortOrder', required: false, enum: ['asc', 'desc'] }),
    (0, swagger_1.ApiQuery)({ name: 'status', required: false, type: String }),
    __param(0, (0, common_1.Param)('job_seeker_id')),
    __param(1, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, find_all_applied_jobs_for_lms_dto_1.FindAllAppliedJobsForLmsDto]),
    __metadata("design:returntype", void 0)
], ApplicantsController.prototype, "findAllJobsAppliedForLms", null);
exports.ApplicantsController = ApplicantsController = __decorate([
    (0, common_1.Controller)(),
    __metadata("design:paramtypes", [applicants_service_1.ApplicantsService])
], ApplicantsController);
//# sourceMappingURL=applicants.controller.js.map