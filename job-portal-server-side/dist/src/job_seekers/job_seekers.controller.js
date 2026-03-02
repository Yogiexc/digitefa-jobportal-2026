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
exports.JobSeekersController = void 0;
const common_1 = require("@nestjs/common");
const job_seekers_service_1 = require("./job_seekers.service");
const swagger_1 = require("@nestjs/swagger");
const jwt_auth_guard_1 = require("../auth/jwt-auth.guard");
let JobSeekersController = class JobSeekersController {
    constructor(jobSeekersService) {
        this.jobSeekersService = jobSeekersService;
    }
    findAllTalents(page, pageSize, search, sortBy, sortOrder) {
        return this.jobSeekersService.findAllTalents({ page, pageSize, search, sortBy, sortOrder });
    }
    findAll(page, pageSize, search, sortBy, sortOrder) {
        return this.jobSeekersService.findAll({ page, pageSize, search, sortBy, sortOrder });
    }
    findOne(job_seeker_id) {
        return this.jobSeekersService.findOne(job_seeker_id);
    }
};
exports.JobSeekersController = JobSeekersController;
__decorate([
    (0, common_1.Get)('management'),
    (0, swagger_1.ApiBearerAuth)('access-token'),
    (0, common_1.UseGuards)(new jwt_auth_guard_1.JwtAuthGuard(['superadmin'])),
    (0, swagger_1.ApiOperation)({ summary: 'List all job seekers (Talent Management)' }),
    (0, swagger_1.ApiQuery)({ name: 'page', required: false, type: Number, example: 1, description: 'Page number' }),
    (0, swagger_1.ApiQuery)({ name: 'pageSize', required: false, type: Number, example: 10, description: 'Number of items per page' }),
    (0, swagger_1.ApiQuery)({ name: 'search', required: false, type: String, example: '', description: 'Search term' }),
    (0, swagger_1.ApiQuery)({ name: 'sortBy', required: false, type: String, example: '', description: 'Field to sort by' }),
    (0, swagger_1.ApiQuery)({ name: 'sortOrder', required: false, enum: ['asc', 'desc'], example: '', description: 'Sort order' }),
    __param(0, (0, common_1.Query)('page')),
    __param(1, (0, common_1.Query)('pageSize')),
    __param(2, (0, common_1.Query)('search')),
    __param(3, (0, common_1.Query)('sortBy')),
    __param(4, (0, common_1.Query)('sortOrder')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Number, String, String, String]),
    __metadata("design:returntype", void 0)
], JobSeekersController.prototype, "findAllTalents", null);
__decorate([
    (0, common_1.Get)(),
    (0, swagger_1.ApiBearerAuth)('access-token'),
    (0, common_1.UseGuards)(new jwt_auth_guard_1.JwtAuthGuard(['superadmin'])),
    (0, swagger_1.ApiOperation)({ summary: 'List all job seekers' }),
    (0, swagger_1.ApiQuery)({ name: 'page', required: false, type: Number, example: 1, description: 'Page number' }),
    (0, swagger_1.ApiQuery)({ name: 'pageSize', required: false, type: Number, example: 10, description: 'Number of items per page' }),
    (0, swagger_1.ApiQuery)({ name: 'search', required: false, type: String, example: '', description: 'Search term' }),
    (0, swagger_1.ApiQuery)({ name: 'sortBy', required: false, type: String, example: '', description: 'Field to sort by' }),
    (0, swagger_1.ApiQuery)({ name: 'sortOrder', required: false, enum: ['asc', 'desc'], example: '', description: 'Sort order' }),
    __param(0, (0, common_1.Query)('page')),
    __param(1, (0, common_1.Query)('pageSize')),
    __param(2, (0, common_1.Query)('search')),
    __param(3, (0, common_1.Query)('sortBy')),
    __param(4, (0, common_1.Query)('sortOrder')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Number, String, String, String]),
    __metadata("design:returntype", void 0)
], JobSeekersController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)(':job_seeker_id'),
    (0, swagger_1.ApiBearerAuth)('access-token'),
    (0, common_1.UseGuards)(new jwt_auth_guard_1.JwtAuthGuard(['superadmin'])),
    (0, swagger_1.ApiOperation)({ summary: 'Get a job seeker details' }),
    __param(0, (0, common_1.Param)('job_seeker_id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], JobSeekersController.prototype, "findOne", null);
exports.JobSeekersController = JobSeekersController = __decorate([
    (0, swagger_1.ApiTags)('job-seekers'),
    (0, common_1.Controller)('job-seekers'),
    __metadata("design:paramtypes", [job_seekers_service_1.JobSeekersService])
], JobSeekersController);
//# sourceMappingURL=job_seekers.controller.js.map