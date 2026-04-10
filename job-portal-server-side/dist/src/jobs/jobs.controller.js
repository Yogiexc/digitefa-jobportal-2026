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
exports.JobsController = void 0;
const common_1 = require("@nestjs/common");
const jobs_service_1 = require("./jobs.service");
const create_job_dto_1 = require("./dto/create-job.dto");
const update_job_dto_1 = require("./dto/update-job.dto");
const swagger_1 = require("@nestjs/swagger");
const jwt_auth_guard_1 = require("../auth/jwt-auth.guard");
const change_status_applications_dto_1 = require("./dto/change-status-applications.dto");
const invite_talent_dto_1 = require("./dto/invite-talent.dto");
let JobsController = class JobsController {
    constructor(jobsService) {
        this.jobsService = jobsService;
    }
    async createJob(createJobDto, req) {
        return this.jobsService.createJob(createJobDto, req.user);
    }
    findAll(req, page, pageSize, search, sortBy, sortOrder, status) {
        return this.jobsService.findAll(req.user, {
            page,
            pageSize,
            search,
            sortBy,
            sortOrder,
            status,
        });
    }
    async getCompanyInterviews(req, page = '1', limit = '10', search) {
        return this.jobsService.getCompanyInterviews(req.user, parseInt(page), parseInt(limit), search);
    }
    findAllJobCompany(req, company_id, page, pageSize, search, sortBy, sortOrder, status) {
        return this.jobsService.findAllJobCompany(req.user, company_id, {
            page,
            pageSize,
            search,
            sortBy,
            sortOrder,
            status,
        });
    }
    findOne(job_id) {
        return this.jobsService.findOne(job_id);
    }
    update(job_id, updateJobDto, req) {
        return this.jobsService.update(job_id, updateJobDto, req.user);
    }
    reupload(job_id, req) {
        return this.jobsService.reupload(job_id, req.user);
    }
    deleteJob(job_id, req) {
        return this.jobsService.deleteJob(job_id, req.user);
    }
    saveJobs(job_id, req) {
        return this.jobsService.saveJobs(job_id, req.user);
    }
    unsaveJobs(job_id, req) {
        return this.jobsService.unsaveJobs(job_id, req.user);
    }
    findAllJobsSaved(req, page, pageSize, search, sortBy, sortOrder) {
        return this.jobsService.findAllJobsSaved(req.user, {
            page,
            pageSize,
            search,
            sortBy,
            sortOrder,
        });
    }
    async getJobSeekerByApplicationId(req, application_id) {
        return this.jobsService.getJobSeekerByApplicationId(req.user, application_id);
    }
    async findApplicants(req, job_id, page, pageSize, search, sortBy, sortOrder, status, location, startDate, endDate, startSalary, endSalary, startExperience, endExperience) {
        return this.jobsService.findApplicants(job_id, req.user, {
            page,
            pageSize,
            search,
            sortBy,
            sortOrder,
            status,
            location,
            startDate,
            endDate,
            startSalary,
            endSalary,
            startExperience,
            endExperience,
        });
    }
    async getResumeApplicants(req, application_id) {
        return this.jobsService.getResumeApplicants(req.user, application_id);
    }
    async changeStatusApplicant(req, application_id, changeStatusApplicationsDto) {
        return this.jobsService.changeStatusApplicant(req.user, application_id, changeStatusApplicationsDto);
    }
    async inviteTalent(req, job_id, inviteTalentDto) {
        return this.jobsService.inviteTalent(req.user, job_id, inviteTalentDto.job_seeker_id);
    }
    async exportApplicants(req, job_id, format, start, end, res) {
        return this.jobsService.generateCSVOrXLSX(job_id, req.user, start, end, format, res);
    }
    findAllJobsSavedForLms(job_seeker_id) {
        return this.jobsService.findAllJobsSavedForLms(job_seeker_id);
    }
    findOneForLms(job_id) {
        return this.jobsService.findOneForLms(job_id);
    }
};
exports.JobsController = JobsController;
__decorate([
    (0, swagger_1.ApiTags)('jobs'),
    (0, common_1.Post)('jobs'),
    (0, swagger_1.ApiConsumes)('multipart/form-data'),
    (0, swagger_1.ApiConsumes)('application/json'),
    (0, swagger_1.ApiBearerAuth)('access-token'),
    (0, common_1.UseGuards)(new jwt_auth_guard_1.JwtAuthGuard(['company'])),
    (0, swagger_1.ApiOperation)({ summary: 'Create a job', description: 'Create a new job' }),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_job_dto_1.CreateJobDto, Object]),
    __metadata("design:returntype", Promise)
], JobsController.prototype, "createJob", null);
__decorate([
    (0, swagger_1.ApiTags)('jobs'),
    (0, common_1.Get)('jobs'),
    (0, swagger_1.ApiBearerAuth)('access-token'),
    (0, common_1.UseGuards)(new jwt_auth_guard_1.JwtAuthGuard(['company'])),
    (0, swagger_1.ApiOperation)({ summary: 'List all jobs' }),
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
        required: true,
        enum: ['all', 'active', 'expired', 'draft'],
        example: 'all',
        description: 'Status jobs',
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
], JobsController.prototype, "findAll", null);
__decorate([
    (0, swagger_1.ApiTags)('jobs-applicants'),
    (0, common_1.Get)('jobs/company/interviews'),
    (0, swagger_1.ApiBearerAuth)('access-token'),
    (0, common_1.UseGuards)(new jwt_auth_guard_1.JwtAuthGuard(['company'])),
    (0, swagger_1.ApiOperation)({ summary: 'Get all interviews for a company' }),
    (0, swagger_1.ApiQuery)({ name: 'page', required: false, type: Number }),
    (0, swagger_1.ApiQuery)({ name: 'limit', required: false, type: Number }),
    (0, swagger_1.ApiQuery)({ name: 'search', required: false, type: String }),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Query)('page')),
    __param(2, (0, common_1.Query)('limit')),
    __param(3, (0, common_1.Query)('search')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, String, String]),
    __metadata("design:returntype", Promise)
], JobsController.prototype, "getCompanyInterviews", null);
__decorate([
    (0, swagger_1.ApiTags)('companies'),
    (0, common_1.Get)('jobs/company/:company_id'),
    (0, swagger_1.ApiBearerAuth)('access-token'),
    (0, common_1.UseGuards)(new jwt_auth_guard_1.JwtAuthGuard(['superadmin'])),
    (0, swagger_1.ApiOperation)({ summary: 'List all jobs in company' }),
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
        required: true,
        enum: ['all', 'active', 'expired', 'draft'],
        example: 'all',
        description: 'Status jobs',
    }),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Param)('company_id')),
    __param(2, (0, common_1.Query)('page')),
    __param(3, (0, common_1.Query)('pageSize')),
    __param(4, (0, common_1.Query)('search')),
    __param(5, (0, common_1.Query)('sortBy')),
    __param(6, (0, common_1.Query)('sortOrder')),
    __param(7, (0, common_1.Query)('status')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, Number, Number, String, String, String, String]),
    __metadata("design:returntype", void 0)
], JobsController.prototype, "findAllJobCompany", null);
__decorate([
    (0, swagger_1.ApiTags)('companies'),
    (0, swagger_1.ApiTags)('jobs'),
    (0, common_1.Get)('jobs/:job_id'),
    (0, swagger_1.ApiBearerAuth)('access-token'),
    (0, common_1.UseGuards)(new jwt_auth_guard_1.JwtAuthGuard(['company', 'superadmin'])),
    (0, swagger_1.ApiOperation)({ summary: 'Get detail a job' }),
    __param(0, (0, common_1.Param)('job_id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], JobsController.prototype, "findOne", null);
__decorate([
    (0, swagger_1.ApiTags)('jobs'),
    (0, common_1.Put)('jobs/:job_id'),
    (0, swagger_1.ApiConsumes)('multipart/form-data'),
    (0, swagger_1.ApiConsumes)('application/json'),
    (0, swagger_1.ApiBearerAuth)('access-token'),
    (0, common_1.UseGuards)(new jwt_auth_guard_1.JwtAuthGuard(['company'])),
    (0, swagger_1.ApiOperation)({ summary: 'Update a jobs' }),
    __param(0, (0, common_1.Param)('job_id')),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, update_job_dto_1.UpdateJobDto, Object]),
    __metadata("design:returntype", void 0)
], JobsController.prototype, "update", null);
__decorate([
    (0, swagger_1.ApiTags)('jobs'),
    (0, common_1.Post)('jobs/:job_id/reupload'),
    (0, swagger_1.ApiBearerAuth)('access-token'),
    (0, common_1.UseGuards)(new jwt_auth_guard_1.JwtAuthGuard(['company'])),
    (0, swagger_1.ApiOperation)({ summary: 'Reupload jobs' }),
    __param(0, (0, common_1.Param)('job_id')),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], JobsController.prototype, "reupload", null);
__decorate([
    (0, swagger_1.ApiTags)('jobs'),
    (0, common_1.Delete)('jobs/:job_id'),
    (0, swagger_1.ApiBearerAuth)('access-token'),
    (0, common_1.UseGuards)(new jwt_auth_guard_1.JwtAuthGuard(['company'])),
    (0, swagger_1.ApiOperation)({ summary: 'Delete jobs' }),
    __param(0, (0, common_1.Param)('job_id')),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], JobsController.prototype, "deleteJob", null);
__decorate([
    (0, swagger_1.ApiTags)('job-seeker-saved-jobs'),
    (0, common_1.Post)('jobs/:job_id/save'),
    (0, swagger_1.ApiBearerAuth)('access-token'),
    (0, common_1.UseGuards)(new jwt_auth_guard_1.JwtAuthGuard(['job_seeker'])),
    (0, swagger_1.ApiOperation)({ summary: 'Save jobs (by job seeker)' }),
    __param(0, (0, common_1.Param)('job_id')),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], JobsController.prototype, "saveJobs", null);
__decorate([
    (0, swagger_1.ApiTags)('job-seeker-saved-jobs'),
    (0, common_1.Post)('jobs/:job_id/unsave'),
    (0, swagger_1.ApiBearerAuth)('access-token'),
    (0, common_1.UseGuards)(new jwt_auth_guard_1.JwtAuthGuard(['job_seeker'])),
    (0, swagger_1.ApiOperation)({ summary: 'Unsave jobs (by job seeker)' }),
    __param(0, (0, common_1.Param)('job_id')),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], JobsController.prototype, "unsaveJobs", null);
__decorate([
    (0, swagger_1.ApiTags)('job-seeker-saved-jobs'),
    (0, common_1.Get)('saved/jobs'),
    (0, swagger_1.ApiBearerAuth)('access-token'),
    (0, common_1.UseGuards)(new jwt_auth_guard_1.JwtAuthGuard(['job_seeker'])),
    (0, swagger_1.ApiOperation)({ summary: 'List all jobs saved by job seeker' }),
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
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Query)('page')),
    __param(2, (0, common_1.Query)('pageSize')),
    __param(3, (0, common_1.Query)('search')),
    __param(4, (0, common_1.Query)('sortBy')),
    __param(5, (0, common_1.Query)('sortOrder')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Number, Number, String, String, String]),
    __metadata("design:returntype", void 0)
], JobsController.prototype, "findAllJobsSaved", null);
__decorate([
    (0, swagger_1.ApiTags)('jobs-applicants'),
    (0, common_1.Get)('jobs/applicants/detail/:application_id'),
    (0, swagger_1.ApiBearerAuth)('access-token'),
    (0, common_1.UseGuards)(new jwt_auth_guard_1.JwtAuthGuard(['company'])),
    (0, swagger_1.ApiOperation)({ summary: 'Get detail applicant by application id' }),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Param)('application_id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", Promise)
], JobsController.prototype, "getJobSeekerByApplicationId", null);
__decorate([
    (0, swagger_1.ApiTags)('jobs-applicants'),
    (0, common_1.Get)('jobs/applicants/:job_id'),
    (0, swagger_1.ApiBearerAuth)('access-token'),
    (0, common_1.UseGuards)(new jwt_auth_guard_1.JwtAuthGuard(['company'])),
    (0, swagger_1.ApiOperation)({ summary: 'List all application job vacancy' }),
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
        enum: ['all', 'pending', 'accepted', 'rejected'],
        description: 'Status',
    }),
    (0, swagger_1.ApiQuery)({
        name: 'location',
        required: false,
        type: String,
        example: '',
        description: 'Location',
    }),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Param)('job_id')),
    __param(2, (0, common_1.Query)('page')),
    __param(3, (0, common_1.Query)('pageSize')),
    __param(4, (0, common_1.Query)('search')),
    __param(5, (0, common_1.Query)('sortBy')),
    __param(6, (0, common_1.Query)('sortOrder')),
    __param(7, (0, common_1.Query)('status')),
    __param(8, (0, common_1.Query)('location')),
    __param(9, (0, common_1.Query)('startDate')),
    __param(10, (0, common_1.Query)('endDate')),
    __param(11, (0, common_1.Query)('startSalary')),
    __param(12, (0, common_1.Query)('endSalary')),
    __param(13, (0, common_1.Query)('startExperience')),
    __param(14, (0, common_1.Query)('endExperience')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, Number, Number, String, String, String, String, String, String, String, Number, Number, Number, Number]),
    __metadata("design:returntype", Promise)
], JobsController.prototype, "findApplicants", null);
__decorate([
    (0, swagger_1.ApiTags)('jobs-applicants'),
    (0, common_1.Get)('jobs/applicants/resume/:application_id'),
    (0, swagger_1.ApiBearerAuth)('access-token'),
    (0, common_1.UseGuards)(new jwt_auth_guard_1.JwtAuthGuard(['company'])),
    (0, swagger_1.ApiOperation)({ summary: 'Get resume appicant by application id' }),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Param)('application_id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", Promise)
], JobsController.prototype, "getResumeApplicants", null);
__decorate([
    (0, swagger_1.ApiTags)('jobs-applicants'),
    (0, common_1.Put)('jobs/applicants/change-status/:application_id'),
    (0, swagger_1.ApiBearerAuth)('access-token'),
    (0, common_1.UseGuards)(new jwt_auth_guard_1.JwtAuthGuard(['company'])),
    (0, swagger_1.ApiOperation)({ summary: 'Change status application' }),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Param)('application_id')),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, change_status_applications_dto_1.ChangeStatusApplicationsDto]),
    __metadata("design:returntype", Promise)
], JobsController.prototype, "changeStatusApplicant", null);
__decorate([
    (0, swagger_1.ApiTags)('jobs-invitations'),
    (0, common_1.Post)('jobs/:job_id/invite'),
    (0, swagger_1.ApiBearerAuth)('access-token'),
    (0, common_1.UseGuards)(new jwt_auth_guard_1.JwtAuthGuard(['company'])),
    (0, swagger_1.ApiOperation)({ summary: 'Invite a job seeker to a job' }),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Param)('job_id')),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, invite_talent_dto_1.InviteTalentDto]),
    __metadata("design:returntype", Promise)
], JobsController.prototype, "inviteTalent", null);
__decorate([
    (0, swagger_1.ApiTags)('jobs-applicants'),
    (0, common_1.Post)('jobs/:job_id/applicants/export'),
    (0, swagger_1.ApiBearerAuth)('access-token'),
    (0, common_1.UseGuards)(new jwt_auth_guard_1.JwtAuthGuard(['company'])),
    (0, swagger_1.ApiParam)({
        name: 'job_id',
        required: true,
        type: String,
        description: 'Job ID',
    }),
    (0, swagger_1.ApiQuery)({
        name: 'format',
        required: true,
        enum: ['csv', 'xlsx'],
        description: 'Export format',
    }),
    (0, swagger_1.ApiQuery)({
        name: 'start',
        required: true,
        type: Number,
        description: 'Start row',
    }),
    (0, swagger_1.ApiQuery)({
        name: 'end',
        required: true,
        type: Number,
        description: 'End row',
    }),
    (0, swagger_1.ApiOperation)({ summary: 'Export applicants' }),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Param)('job_id')),
    __param(2, (0, common_1.Query)('format')),
    __param(3, (0, common_1.Query)('start')),
    __param(4, (0, common_1.Query)('end')),
    __param(5, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, String, Number, Number, Object]),
    __metadata("design:returntype", Promise)
], JobsController.prototype, "exportApplicants", null);
__decorate([
    (0, swagger_1.ApiTags)('lms'),
    (0, common_1.Get)('lms/saved-jobs/:job_seeker_id'),
    (0, swagger_1.ApiOperation)({ summary: 'List all jobs saved by a job seeker (for LMS)' }),
    (0, swagger_1.ApiHeader)({
        name: 'X-API-KEY',
        description: 'API Key for server-to-server communication',
    }),
    __param(0, (0, common_1.Param)('job_seeker_id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], JobsController.prototype, "findAllJobsSavedForLms", null);
__decorate([
    (0, swagger_1.ApiTags)('lms'),
    (0, common_1.Get)('jobs/lms/:job_id'),
    (0, swagger_1.ApiOperation)({ summary: 'Get detail of a public job (for LMS integration)' }),
    __param(0, (0, common_1.Param)('job_id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], JobsController.prototype, "findOneForLms", null);
exports.JobsController = JobsController = __decorate([
    (0, common_1.Controller)(),
    __metadata("design:paramtypes", [jobs_service_1.JobsService])
], JobsController);
//# sourceMappingURL=jobs.controller.js.map