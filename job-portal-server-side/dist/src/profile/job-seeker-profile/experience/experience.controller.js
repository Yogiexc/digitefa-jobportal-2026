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
exports.ExperienceController = void 0;
const common_1 = require("@nestjs/common");
const experience_service_1 = require("./experience.service");
const create_experience_dto_1 = require("./dto/create-experience.dto");
const update_experience_dto_1 = require("./dto/update-experience.dto");
const swagger_1 = require("@nestjs/swagger");
const jwt_auth_guard_1 = require("../../../auth/jwt-auth.guard");
let ExperienceController = class ExperienceController {
    constructor(experienceService) {
        this.experienceService = experienceService;
    }
    getExperiences(req) {
        return this.experienceService.getExperiences(req.user);
    }
    getExperience(experience_id, req) {
        return this.experienceService.getExperience(req.user, experience_id);
    }
    addExperience(req, createExperienceDto) {
        return this.experienceService.addExperience(req.user, createExperienceDto);
    }
    updateExperience(experience_id, req, updateExperienceDto) {
        return this.experienceService.updateExperience(req.user, experience_id, updateExperienceDto);
    }
    deleteExperience(experience_id, req) {
        return this.experienceService.deleteExperience(req.user, experience_id);
    }
};
exports.ExperienceController = ExperienceController;
__decorate([
    (0, common_1.Get)(),
    (0, swagger_1.ApiBearerAuth)('access-token'),
    (0, common_1.UseGuards)(new jwt_auth_guard_1.JwtAuthGuard(['job_seeker'])),
    (0, swagger_1.ApiOperation)({ summary: 'Get all experience job seeker' }),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], ExperienceController.prototype, "getExperiences", null);
__decorate([
    (0, common_1.Get)('/:experience_id'),
    (0, swagger_1.ApiBearerAuth)('access-token'),
    (0, common_1.UseGuards)(new jwt_auth_guard_1.JwtAuthGuard(['job_seeker'])),
    (0, swagger_1.ApiOperation)({ summary: 'Get experience job seeker' }),
    __param(0, (0, common_1.Param)('experience_id')),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], ExperienceController.prototype, "getExperience", null);
__decorate([
    (0, common_1.Post)(),
    (0, swagger_1.ApiConsumes)('multipart/form-data'),
    (0, swagger_1.ApiConsumes)('application/json'),
    (0, swagger_1.ApiBearerAuth)('access-token'),
    (0, common_1.UseGuards)(new jwt_auth_guard_1.JwtAuthGuard(['job_seeker'])),
    (0, swagger_1.ApiOperation)({ summary: 'Add experience job seeker' }),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, create_experience_dto_1.CreateExperienceDto]),
    __metadata("design:returntype", void 0)
], ExperienceController.prototype, "addExperience", null);
__decorate([
    (0, common_1.Put)('/:experience_id'),
    (0, swagger_1.ApiConsumes)('multipart/form-data'),
    (0, swagger_1.ApiConsumes)('application/json'),
    (0, swagger_1.ApiBearerAuth)('access-token'),
    (0, common_1.UseGuards)(new jwt_auth_guard_1.JwtAuthGuard(['job_seeker'])),
    (0, swagger_1.ApiOperation)({ summary: 'Update experience job seeker' }),
    __param(0, (0, common_1.Param)('experience_id')),
    __param(1, (0, common_1.Request)()),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object, update_experience_dto_1.UpdateExperienceDto]),
    __metadata("design:returntype", void 0)
], ExperienceController.prototype, "updateExperience", null);
__decorate([
    (0, common_1.Delete)('/:experience_id'),
    (0, swagger_1.ApiBearerAuth)('access-token'),
    (0, common_1.UseGuards)(new jwt_auth_guard_1.JwtAuthGuard(['job_seeker'])),
    (0, swagger_1.ApiOperation)({ summary: 'Delete experience job seeker' }),
    __param(0, (0, common_1.Param)('experience_id')),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], ExperienceController.prototype, "deleteExperience", null);
exports.ExperienceController = ExperienceController = __decorate([
    (0, swagger_1.ApiTags)('job-seeker-profile-experience'),
    (0, common_1.Controller)('profile/job-seeker/experience'),
    __metadata("design:paramtypes", [experience_service_1.ExperienceService])
], ExperienceController);
//# sourceMappingURL=experience.controller.js.map