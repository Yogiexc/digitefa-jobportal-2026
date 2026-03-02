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
exports.SkillsCategoryController = void 0;
const common_1 = require("@nestjs/common");
const skills_category_service_1 = require("./skills-category.service");
const create_skills_category_dto_1 = require("./dto/create-skills-category.dto");
const update_skills_category_dto_1 = require("./dto/update-skills-category.dto");
const swagger_1 = require("@nestjs/swagger");
const jwt_auth_guard_1 = require("../../auth/jwt-auth.guard");
let SkillsCategoryController = class SkillsCategoryController {
    constructor(skillsCategoryService) {
        this.skillsCategoryService = skillsCategoryService;
    }
    create(createSkillsCategoryDto) {
        return this.skillsCategoryService.create(createSkillsCategoryDto);
    }
    findAll(page, pageSize, search, sortBy, sortOrder) {
        return this.skillsCategoryService.findAll({ page, pageSize, search, sortBy, sortOrder });
    }
    findOne(skill_category_id) {
        return this.skillsCategoryService.findOne(skill_category_id);
    }
    getListSkills(skill_category_id) {
        return this.skillsCategoryService.getListSkills(skill_category_id);
    }
    getListSkillsByCategoryName(category_name) {
        return this.skillsCategoryService.getListSkillsByCategoryName(category_name);
    }
    update(skill_category_id, updateSkillsCategoryDto) {
        return this.skillsCategoryService.update(skill_category_id, updateSkillsCategoryDto);
    }
    remove(skill_category_id) {
        return this.skillsCategoryService.remove(skill_category_id);
    }
};
exports.SkillsCategoryController = SkillsCategoryController;
__decorate([
    (0, common_1.Post)(),
    (0, swagger_1.ApiConsumes)('multipart/form-data'),
    (0, swagger_1.ApiConsumes)('application/json'),
    (0, swagger_1.ApiBearerAuth)('access-token'),
    (0, common_1.UseGuards)(new jwt_auth_guard_1.JwtAuthGuard(['superadmin'])),
    (0, swagger_1.ApiOperation)({ summary: 'Create a skill category' }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_skills_category_dto_1.CreateSkillsCategoryDto]),
    __metadata("design:returntype", void 0)
], SkillsCategoryController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(),
    (0, swagger_1.ApiOperation)({ summary: 'List all skill category' }),
    (0, swagger_1.ApiQuery)({ name: 'page', required: false, type: Number, example: 1, description: 'Page number' }),
    (0, swagger_1.ApiQuery)({ name: 'pageSize', required: false, type: Number, example: 10, description: 'Number of items per page' }),
    (0, swagger_1.ApiQuery)({ name: 'search', required: false, type: String, example: '', description: 'Search term' }),
    (0, swagger_1.ApiQuery)({ name: 'sortBy', required: false, type: String, example: '', description: 'Field to sort by' }),
    (0, swagger_1.ApiQuery)({ name: 'sortOrder', required: false, enum: ['asc', 'desc'], example: 'asc', description: 'Sort order' }),
    __param(0, (0, common_1.Query)('page')),
    __param(1, (0, common_1.Query)('pageSize')),
    __param(2, (0, common_1.Query)('search')),
    __param(3, (0, common_1.Query)('sortBy')),
    __param(4, (0, common_1.Query)('sortOrder')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Number, String, String, String]),
    __metadata("design:returntype", void 0)
], SkillsCategoryController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)(':skill_category_id'),
    (0, swagger_1.ApiBearerAuth)('access-token'),
    (0, common_1.UseGuards)(new jwt_auth_guard_1.JwtAuthGuard(['superadmin'])),
    (0, swagger_1.ApiOperation)({ summary: 'Get a skill category' }),
    __param(0, (0, common_1.Param)('skill_category_id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], SkillsCategoryController.prototype, "findOne", null);
__decorate([
    (0, common_1.Get)('/list-skills/:skill_category_id'),
    (0, swagger_1.ApiOperation)({ summary: 'List all skills in a skill category by category id' }),
    __param(0, (0, common_1.Param)('skill_category_id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], SkillsCategoryController.prototype, "getListSkills", null);
__decorate([
    (0, common_1.Get)('/list-skills-name/:category_name'),
    (0, swagger_1.ApiOperation)({ summary: 'List all skills in a skill category by category name' }),
    __param(0, (0, common_1.Param)('category_name')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], SkillsCategoryController.prototype, "getListSkillsByCategoryName", null);
__decorate([
    (0, common_1.Put)(':skill_category_id'),
    (0, swagger_1.ApiConsumes)('multipart/form-data'),
    (0, swagger_1.ApiConsumes)('application/json'),
    (0, swagger_1.ApiBearerAuth)('access-token'),
    (0, common_1.UseGuards)(new jwt_auth_guard_1.JwtAuthGuard(['superadmin'])),
    (0, swagger_1.ApiOperation)({ summary: 'Update a skill category' }),
    __param(0, (0, common_1.Param)('skill_category_id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, update_skills_category_dto_1.UpdateSkillsCategoryDto]),
    __metadata("design:returntype", void 0)
], SkillsCategoryController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':skill_category_id'),
    (0, swagger_1.ApiBearerAuth)('access-token'),
    (0, common_1.UseGuards)(new jwt_auth_guard_1.JwtAuthGuard(['superadmin'])),
    (0, swagger_1.ApiOperation)({ summary: 'Delete a skill category' }),
    __param(0, (0, common_1.Param)('skill_category_id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], SkillsCategoryController.prototype, "remove", null);
exports.SkillsCategoryController = SkillsCategoryController = __decorate([
    (0, swagger_1.ApiTags)('skills-category'),
    (0, common_1.Controller)('skills-category'),
    __metadata("design:paramtypes", [skills_category_service_1.SkillsCategoryService])
], SkillsCategoryController);
//# sourceMappingURL=skills-category.controller.js.map