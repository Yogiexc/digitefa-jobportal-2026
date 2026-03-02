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
exports.JobsSearchController = void 0;
const common_1 = require("@nestjs/common");
const jobs_search_service_1 = require("./jobs-search.service");
const swagger_1 = require("@nestjs/swagger");
const jwt_auth_guard_1 = require("../auth/jwt-auth.guard");
let JobsSearchController = class JobsSearchController {
    constructor(jobsSearchService) {
        this.jobsSearchService = jobsSearchService;
    }
    async findJobs(req, page, pageSize, search, location, sortBy, recommendationSort, employmentType, salaryType, minimumSalary, maximumSalary, category, educationLevel, experienceLevel) {
        return this.jobsSearchService.findJobs(req?.user, {
            page,
            pageSize,
            search,
            location,
            sortBy,
            recommendationSort,
            employmentType,
            salaryType,
            minimumSalary,
            maximumSalary,
            category,
            educationLevel,
            experienceLevel,
        });
    }
    async getDetailCompany(req, company_id) {
        return this.jobsSearchService.getDetailCompany(req?.user, company_id);
    }
    async getDetailJob(req, job_id) {
        return this.jobsSearchService.getDetailJob(req?.user, job_id);
    }
};
exports.JobsSearchController = JobsSearchController;
__decorate([
    (0, common_1.Get)(),
    (0, swagger_1.ApiBearerAuth)('access-token'),
    (0, common_1.UseGuards)(new jwt_auth_guard_1.JwtAuthGuard(['public', 'job_seeker'])),
    (0, swagger_1.ApiOperation)({ summary: 'Jobs Search' }),
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
        description: 'Search by Name',
    }),
    (0, swagger_1.ApiQuery)({
        name: 'location',
        required: false,
        type: String,
        example: '',
        description: 'Search by Location',
    }),
    (0, swagger_1.ApiQuery)({
        name: 'sortBy',
        required: false,
        enum: ['most_relevant', 'most_recent'],
        description: 'Field to sort by',
    }),
    (0, swagger_1.ApiQuery)({
        name: 'recommendationSort',
        required: false,
        type: [String],
        description: 'Recommendation sort by',
    }),
    (0, swagger_1.ApiQuery)({
        name: 'employmentType',
        required: false,
        type: [String],
        description: 'Employment Type (can be multiple)',
    }),
    (0, swagger_1.ApiQuery)({
        name: 'salaryType',
        required: false,
        type: [String],
        description: 'Salary Type (can be multiple)',
    }),
    (0, swagger_1.ApiQuery)({
        name: 'minimumSalary',
        required: false,
        type: Number,
        description: 'Minimum Salary',
    }),
    (0, swagger_1.ApiQuery)({
        name: 'maximumSalary',
        required: false,
        type: Number,
        description: 'Maximum Salary',
    }),
    (0, swagger_1.ApiQuery)({
        name: 'category',
        required: false,
        type: [String],
        description: 'Job Category (can be multiple)',
    }),
    (0, swagger_1.ApiQuery)({
        name: 'educationLevel',
        required: false,
        type: [String],
        description: 'Education Level (can be multiple)',
    }),
    (0, swagger_1.ApiQuery)({
        name: 'experienceLevel',
        required: false,
        type: [String],
        description: 'Experience Level (can be multiple)',
    }),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Query)('page')),
    __param(2, (0, common_1.Query)('pageSize')),
    __param(3, (0, common_1.Query)('search')),
    __param(4, (0, common_1.Query)('location')),
    __param(5, (0, common_1.Query)('sortBy')),
    __param(6, (0, common_1.Query)('recommendationSort', new common_1.DefaultValuePipe([]), new common_1.ParseArrayPipe({ items: String, optional: true, separator: ',' }))),
    __param(7, (0, common_1.Query)('employmentType')),
    __param(8, (0, common_1.Query)('salaryType')),
    __param(9, (0, common_1.Query)('minimumSalary')),
    __param(10, (0, common_1.Query)('maximumSalary')),
    __param(11, (0, common_1.Query)('category')),
    __param(12, (0, common_1.Query)('educationLevel')),
    __param(13, (0, common_1.Query)('experienceLevel')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Number, Number, String, String, String, Array, Array, Array, Number, Number, Array, Array, Array]),
    __metadata("design:returntype", Promise)
], JobsSearchController.prototype, "findJobs", null);
__decorate([
    (0, common_1.Get)('company/:company_id'),
    (0, swagger_1.ApiBearerAuth)('access-token'),
    (0, common_1.UseGuards)(new jwt_auth_guard_1.JwtAuthGuard(['public', 'job_seeker'])),
    (0, swagger_1.ApiOperation)({ summary: 'Get Company Jobs' }),
    (0, swagger_1.ApiParam)({
        name: 'company_id',
        required: true,
        type: String,
        example: '123',
        description: 'Company ID',
    }),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Param)('company_id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", Promise)
], JobsSearchController.prototype, "getDetailCompany", null);
__decorate([
    (0, common_1.Get)('/:job_id'),
    (0, swagger_1.ApiBearerAuth)('access-token'),
    (0, common_1.UseGuards)(new jwt_auth_guard_1.JwtAuthGuard(['public', 'job_seeker'])),
    (0, swagger_1.ApiOperation)({ summary: 'Get Detail Job' }),
    (0, swagger_1.ApiParam)({
        name: 'job_id',
        required: true,
        type: String,
        example: '123',
        description: 'Job ID',
    }),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Param)('job_id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", Promise)
], JobsSearchController.prototype, "getDetailJob", null);
exports.JobsSearchController = JobsSearchController = __decorate([
    (0, swagger_1.ApiTags)('jobs-search'),
    (0, common_1.Controller)('jobs-search'),
    __metadata("design:paramtypes", [jobs_search_service_1.JobsSearchService])
], JobsSearchController);
//# sourceMappingURL=jobs-search.controller.js.map