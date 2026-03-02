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
exports.SkillsController = void 0;
const common_1 = require("@nestjs/common");
const skills_service_1 = require("./skills.service");
const create_skill_dto_1 = require("./dto/create-skill.dto");
const swagger_1 = require("@nestjs/swagger");
const jwt_auth_guard_1 = require("../../../auth/jwt-auth.guard");
let SkillsController = class SkillsController {
    constructor(skillsService) {
        this.skillsService = skillsService;
    }
    async getSkills(req) {
        return this.skillsService.getSkills(req.user);
    }
    async updateSkills(req, updateSkillsDto) {
        return this.skillsService.createSkills(req.user, updateSkillsDto);
    }
    async deleteSkill(req, skill_id) {
        return this.skillsService.deleteSkill(req.user, skill_id);
    }
};
exports.SkillsController = SkillsController;
__decorate([
    (0, common_1.Get)('skills'),
    (0, swagger_1.ApiBearerAuth)('access-token'),
    (0, common_1.UseGuards)(new jwt_auth_guard_1.JwtAuthGuard(['job_seeker'])),
    (0, swagger_1.ApiOperation)({ summary: 'Get job seeker skills' }),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], SkillsController.prototype, "getSkills", null);
__decorate([
    (0, common_1.Post)('skills'),
    (0, swagger_1.ApiConsumes)('multipart/form-data'),
    (0, swagger_1.ApiConsumes)('application/json'),
    (0, swagger_1.ApiBearerAuth)('access-token'),
    (0, common_1.UseGuards)(new jwt_auth_guard_1.JwtAuthGuard(['job_seeker'])),
    (0, swagger_1.ApiOperation)({ summary: 'Create skills job seeker' }),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, create_skill_dto_1.CreateSkillDto]),
    __metadata("design:returntype", Promise)
], SkillsController.prototype, "updateSkills", null);
__decorate([
    (0, common_1.Delete)('skills/:skill_id'),
    (0, swagger_1.ApiBearerAuth)('access-token'),
    (0, common_1.UseGuards)(new jwt_auth_guard_1.JwtAuthGuard(['job_seeker'])),
    (0, swagger_1.ApiOperation)({ summary: 'Delete a job seeker skill' }),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Param)('skill_id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", Promise)
], SkillsController.prototype, "deleteSkill", null);
exports.SkillsController = SkillsController = __decorate([
    (0, swagger_1.ApiTags)('job-seeker-profile-skills'),
    (0, common_1.Controller)('profile/job-seeker'),
    __metadata("design:paramtypes", [skills_service_1.SkillsService])
], SkillsController);
//# sourceMappingURL=skills.controller.js.map