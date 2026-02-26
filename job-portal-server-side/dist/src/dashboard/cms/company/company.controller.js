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
exports.CompanyController = void 0;
const common_1 = require("@nestjs/common");
const company_service_1 = require("./company.service");
const swagger_1 = require("@nestjs/swagger");
const jwt_auth_guard_1 = require("../../../auth/jwt-auth.guard");
let CompanyController = class CompanyController {
    constructor(companyService) {
        this.companyService = companyService;
    }
    async totalTalents(req) {
        return this.companyService.getTotalJobVacancies(req.user);
    }
    async jobOverview(req, year) {
        return this.companyService.getJobOverview(req.user, year);
    }
    async talentsAcceptanceRatio(req) {
        return this.companyService.talentsAcceptanceRatio(req.user);
    }
};
exports.CompanyController = CompanyController;
__decorate([
    (0, common_1.Get)('total-job-vacancies'),
    (0, swagger_1.ApiBearerAuth)('access-token'),
    (0, common_1.UseGuards)(new jwt_auth_guard_1.JwtAuthGuard(['company'])),
    (0, swagger_1.ApiOperation)({ summary: 'Get total job vacancy' }),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], CompanyController.prototype, "totalTalents", null);
__decorate([
    (0, common_1.Get)('job-overview'),
    (0, swagger_1.ApiBearerAuth)('access-token'),
    (0, common_1.UseGuards)(new jwt_auth_guard_1.JwtAuthGuard(['company'])),
    (0, swagger_1.ApiOperation)({ summary: 'Get job overview' }),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Query)('year')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Number]),
    __metadata("design:returntype", Promise)
], CompanyController.prototype, "jobOverview", null);
__decorate([
    (0, common_1.Get)('talents-acceptance-ratio'),
    (0, swagger_1.ApiBearerAuth)('access-token'),
    (0, common_1.UseGuards)(new jwt_auth_guard_1.JwtAuthGuard(['company'])),
    (0, swagger_1.ApiOperation)({ summary: 'Get talents acceptance ratio' }),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], CompanyController.prototype, "talentsAcceptanceRatio", null);
exports.CompanyController = CompanyController = __decorate([
    (0, swagger_1.ApiTags)('dashboard-company'),
    (0, common_1.Controller)('dashboard/cms/company'),
    __metadata("design:paramtypes", [company_service_1.CompanyService])
], CompanyController);
//# sourceMappingURL=company.controller.js.map