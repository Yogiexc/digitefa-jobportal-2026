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
exports.CertificationsController = void 0;
const common_1 = require("@nestjs/common");
const certifications_service_1 = require("./certifications.service");
const jwt_auth_guard_1 = require("../../../auth/jwt-auth.guard");
const swagger_1 = require("@nestjs/swagger");
const create_certification_dto_1 = require("./dto/create-certification.dto");
let CertificationsController = class CertificationsController {
    constructor(certificationsService) {
        this.certificationsService = certificationsService;
    }
    getCertifications(req) {
        return this.certificationsService.getCertifications(req.user);
    }
    getCertification(certification_id, req) {
        return this.certificationsService.getCertification(req.user, certification_id);
    }
    addCertifications(req, createCertificationDto) {
        return this.certificationsService.addCertifications(req.user, createCertificationDto);
    }
    updateCertifications(certification_id, req, createCertificationDto) {
        return this.certificationsService.updateCertifications(req.user, certification_id, createCertificationDto);
    }
    deleteCertifications(certification_id, req) {
        return this.certificationsService.deleteCertifications(req.user, certification_id);
    }
};
exports.CertificationsController = CertificationsController;
__decorate([
    (0, common_1.Get)(),
    (0, swagger_1.ApiBearerAuth)('access-token'),
    (0, common_1.UseGuards)(new jwt_auth_guard_1.JwtAuthGuard(['job_seeker'])),
    (0, swagger_1.ApiOperation)({ summary: 'Get all certifications job seeker' }),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], CertificationsController.prototype, "getCertifications", null);
__decorate([
    (0, common_1.Get)('/:certification_id'),
    (0, swagger_1.ApiBearerAuth)('access-token'),
    (0, common_1.UseGuards)(new jwt_auth_guard_1.JwtAuthGuard(['job_seeker'])),
    (0, swagger_1.ApiOperation)({ summary: 'Get a certification job seeker' }),
    __param(0, (0, common_1.Param)('certification_id')),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], CertificationsController.prototype, "getCertification", null);
__decorate([
    (0, common_1.Post)(),
    (0, swagger_1.ApiConsumes)('multipart/form-data'),
    (0, swagger_1.ApiConsumes)('application/json'),
    (0, swagger_1.ApiBearerAuth)('access-token'),
    (0, common_1.UseGuards)(new jwt_auth_guard_1.JwtAuthGuard(['job_seeker'])),
    (0, swagger_1.ApiOperation)({ summary: 'Add certifications job seeker' }),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, create_certification_dto_1.CreateCertificationDto]),
    __metadata("design:returntype", void 0)
], CertificationsController.prototype, "addCertifications", null);
__decorate([
    (0, common_1.Put)('/:certification_id'),
    (0, swagger_1.ApiConsumes)('multipart/form-data'),
    (0, swagger_1.ApiConsumes)('application/json'),
    (0, swagger_1.ApiBearerAuth)('access-token'),
    (0, common_1.UseGuards)(new jwt_auth_guard_1.JwtAuthGuard(['job_seeker'])),
    (0, swagger_1.ApiOperation)({ summary: 'Update certifications job seeker' }),
    __param(0, (0, common_1.Param)('certification_id')),
    __param(1, (0, common_1.Request)()),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object, create_certification_dto_1.CreateCertificationDto]),
    __metadata("design:returntype", void 0)
], CertificationsController.prototype, "updateCertifications", null);
__decorate([
    (0, common_1.Delete)('/:certification_id'),
    (0, swagger_1.ApiBearerAuth)('access-token'),
    (0, common_1.UseGuards)(new jwt_auth_guard_1.JwtAuthGuard(['job_seeker'])),
    (0, swagger_1.ApiOperation)({ summary: 'Delete certifications job seeker' }),
    __param(0, (0, common_1.Param)('certification_id')),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], CertificationsController.prototype, "deleteCertifications", null);
exports.CertificationsController = CertificationsController = __decorate([
    (0, swagger_1.ApiTags)('job-seeker-profile-certifications'),
    (0, common_1.Controller)('profile/job-seeker/certifications'),
    __metadata("design:paramtypes", [certifications_service_1.CertificationsService])
], CertificationsController);
//# sourceMappingURL=certifications.controller.js.map