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
exports.UniversityController = void 0;
const common_1 = require("@nestjs/common");
const university_service_1 = require("./university.service");
const swagger_1 = require("@nestjs/swagger");
const jwt_auth_guard_1 = require("../../../auth/jwt-auth.guard");
let UniversityController = class UniversityController {
    constructor(universityService) {
        this.universityService = universityService;
    }
    async totalStudents(req) {
        return this.universityService.getTotalStudents(req.user);
    }
    async studentActivities(req, year) {
        return this.universityService.studentActivities(req.user, year);
    }
    async enrolledStudents(req) {
        return this.universityService.getEnrolledStudents(req.user);
    }
    async studentEmploymentRatio(req) {
        return this.universityService.studentEmploymentRatio(req.user);
    }
};
exports.UniversityController = UniversityController;
__decorate([
    (0, common_1.Get)('total-students'),
    (0, swagger_1.ApiBearerAuth)('access-token'),
    (0, common_1.UseGuards)(new jwt_auth_guard_1.JwtAuthGuard(['university'])),
    (0, swagger_1.ApiOperation)({ summary: 'Get total students' }),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], UniversityController.prototype, "totalStudents", null);
__decorate([
    (0, common_1.Get)('student-activities'),
    (0, swagger_1.ApiBearerAuth)('access-token'),
    (0, common_1.UseGuards)(new jwt_auth_guard_1.JwtAuthGuard(['university'])),
    (0, swagger_1.ApiOperation)({ summary: 'Get Student Activities' }),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Query)('year')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Number]),
    __metadata("design:returntype", Promise)
], UniversityController.prototype, "studentActivities", null);
__decorate([
    (0, common_1.Get)('enrolled-students'),
    (0, swagger_1.ApiBearerAuth)('access-token'),
    (0, common_1.UseGuards)(new jwt_auth_guard_1.JwtAuthGuard(['university'])),
    (0, swagger_1.ApiOperation)({ summary: 'Get Enrolled Students' }),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], UniversityController.prototype, "enrolledStudents", null);
__decorate([
    (0, common_1.Get)('student-employment-ratio'),
    (0, swagger_1.ApiBearerAuth)('access-token'),
    (0, common_1.UseGuards)(new jwt_auth_guard_1.JwtAuthGuard(['university'])),
    (0, swagger_1.ApiOperation)({ summary: 'Get student employment ratio' }),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], UniversityController.prototype, "studentEmploymentRatio", null);
exports.UniversityController = UniversityController = __decorate([
    (0, swagger_1.ApiTags)('dashboard-university'),
    (0, common_1.Controller)('dashboard/cms/university'),
    __metadata("design:paramtypes", [university_service_1.UniversityService])
], UniversityController);
//# sourceMappingURL=university.controller.js.map