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
exports.SuperadminController = void 0;
const common_1 = require("@nestjs/common");
const superadmin_service_1 = require("./superadmin.service");
const swagger_1 = require("@nestjs/swagger");
const jwt_auth_guard_1 = require("../../../auth/jwt-auth.guard");
let SuperadminController = class SuperadminController {
    constructor(superadminService) {
        this.superadminService = superadminService;
    }
    async totalTalents(time = 'all') {
        return this.superadminService.getTotalTalents(time);
    }
    async totalCompanies(time = 'all') {
        return this.superadminService.getTotalCompanies(time);
    }
    async totalUniversities(time = 'all') {
        return this.superadminService.getTotalUniversities(time);
    }
    async recentJobs(limit = 5) {
        return this.superadminService.getRecentJobs(limit);
    }
    getTalentsOverview(week, month) {
        return this.superadminService.getTalentsOverview(week, month);
    }
    getCompaniesUniversitiesOverview(month) {
        return this.superadminService.getCompaniesUniversitiesOverview(month);
    }
};
exports.SuperadminController = SuperadminController;
__decorate([
    (0, common_1.Get)('total-talents'),
    (0, swagger_1.ApiBearerAuth)('access-token'),
    (0, common_1.UseGuards)(new jwt_auth_guard_1.JwtAuthGuard(['superadmin'])),
    (0, swagger_1.ApiOperation)({ summary: 'Get total talents' }),
    (0, swagger_1.ApiQuery)({ name: 'time', required: false, enum: ['week', 'month', 'all'], example: 'all', description: 'Time period' }),
    __param(0, (0, common_1.Query)('time')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], SuperadminController.prototype, "totalTalents", null);
__decorate([
    (0, common_1.Get)('total-companies'),
    (0, swagger_1.ApiBearerAuth)('access-token'),
    (0, common_1.UseGuards)(new jwt_auth_guard_1.JwtAuthGuard(['superadmin'])),
    (0, swagger_1.ApiOperation)({ summary: 'Get total companies' }),
    (0, swagger_1.ApiQuery)({ name: 'time', required: false, enum: ['week', 'month', 'all'], example: 'all', description: 'Time period' }),
    __param(0, (0, common_1.Query)('time')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], SuperadminController.prototype, "totalCompanies", null);
__decorate([
    (0, common_1.Get)('total-universities'),
    (0, swagger_1.ApiBearerAuth)('access-token'),
    (0, common_1.UseGuards)(new jwt_auth_guard_1.JwtAuthGuard(['superadmin'])),
    (0, swagger_1.ApiOperation)({ summary: 'Get total universities' }),
    (0, swagger_1.ApiQuery)({ name: 'time', required: false, enum: ['week', 'month', 'all'], example: 'all', description: 'Time period' }),
    __param(0, (0, common_1.Query)('time')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], SuperadminController.prototype, "totalUniversities", null);
__decorate([
    (0, common_1.Get)('recent-jobs'),
    (0, swagger_1.ApiBearerAuth)('access-token'),
    (0, common_1.UseGuards)(new jwt_auth_guard_1.JwtAuthGuard(['superadmin'])),
    (0, swagger_1.ApiOperation)({ summary: 'Get recent jobs' }),
    (0, swagger_1.ApiQuery)({ name: 'limit', required: false, example: 5, description: 'Number of jobs' }),
    __param(0, (0, common_1.Query)('limit')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], SuperadminController.prototype, "recentJobs", null);
__decorate([
    (0, common_1.Get)('talents-overview'),
    (0, swagger_1.ApiBearerAuth)('access-token'),
    (0, common_1.UseGuards)(new jwt_auth_guard_1.JwtAuthGuard(['superadmin'])),
    (0, swagger_1.ApiOperation)({ summary: 'Get talents overview' }),
    (0, swagger_1.ApiQuery)({ name: 'week', required: true, type: Number, example: 1, description: 'Week number' }),
    (0, swagger_1.ApiQuery)({ name: 'month', required: true, type: Number, example: 1, description: 'Month number' }),
    __param(0, (0, common_1.Query)('week')),
    __param(1, (0, common_1.Query)('month')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Number]),
    __metadata("design:returntype", void 0)
], SuperadminController.prototype, "getTalentsOverview", null);
__decorate([
    (0, common_1.Get)('companies-universities-overview'),
    (0, swagger_1.ApiBearerAuth)('access-token'),
    (0, common_1.UseGuards)(new jwt_auth_guard_1.JwtAuthGuard(['superadmin'])),
    (0, swagger_1.ApiOperation)({ summary: 'Get companies and universities overview' }),
    (0, swagger_1.ApiQuery)({ name: 'month', required: true, type: Number, example: 1, description: 'Month number' }),
    __param(0, (0, common_1.Query)('month')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", void 0)
], SuperadminController.prototype, "getCompaniesUniversitiesOverview", null);
exports.SuperadminController = SuperadminController = __decorate([
    (0, swagger_1.ApiTags)('dashboard-superadmin'),
    (0, common_1.Controller)('dashboard/cms/superadmin'),
    __metadata("design:paramtypes", [superadmin_service_1.SuperadminService])
], SuperadminController);
//# sourceMappingURL=superadmin.controller.js.map