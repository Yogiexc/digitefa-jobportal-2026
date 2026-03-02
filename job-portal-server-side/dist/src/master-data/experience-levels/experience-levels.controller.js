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
exports.ExperienceLevelsController = void 0;
const common_1 = require("@nestjs/common");
const experience_levels_service_1 = require("./experience-levels.service");
const create_experience_level_dto_1 = require("./dto/create-experience-level.dto");
const update_experience_level_dto_1 = require("./dto/update-experience-level.dto");
const swagger_1 = require("@nestjs/swagger");
const jwt_auth_guard_1 = require("../../auth/jwt-auth.guard");
let ExperienceLevelsController = class ExperienceLevelsController {
    constructor(experienceLevelsService) {
        this.experienceLevelsService = experienceLevelsService;
    }
    create(createExperienceLevelDto) {
        return this.experienceLevelsService.create(createExperienceLevelDto);
    }
    findAll(page, pageSize, search, sortBy, sortOrder) {
        return this.experienceLevelsService.findAll({ page, pageSize, search, sortBy, sortOrder });
    }
    findOne(experience_level_id) {
        return this.experienceLevelsService.findOne(experience_level_id);
    }
    update(experience_level_id, updateExperienceLevelDto) {
        return this.experienceLevelsService.update(experience_level_id, updateExperienceLevelDto);
    }
    remove(experience_level_id) {
        return this.experienceLevelsService.remove(experience_level_id);
    }
};
exports.ExperienceLevelsController = ExperienceLevelsController;
__decorate([
    (0, common_1.Post)(),
    (0, swagger_1.ApiConsumes)('multipart/form-data'),
    (0, swagger_1.ApiConsumes)('application/json'),
    (0, swagger_1.ApiBearerAuth)('access-token'),
    (0, common_1.UseGuards)(new jwt_auth_guard_1.JwtAuthGuard(['superadmin'])),
    (0, swagger_1.ApiOperation)({ summary: 'Create a experience level' }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_experience_level_dto_1.CreateExperienceLevelDto]),
    __metadata("design:returntype", void 0)
], ExperienceLevelsController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(),
    (0, swagger_1.ApiOperation)({ summary: 'List all experience level' }),
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
], ExperienceLevelsController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)(':experience_level_id'),
    (0, swagger_1.ApiBearerAuth)('access-token'),
    (0, common_1.UseGuards)(new jwt_auth_guard_1.JwtAuthGuard(['superadmin'])),
    (0, swagger_1.ApiOperation)({ summary: 'Get a experience level' }),
    __param(0, (0, common_1.Param)('experience_level_id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], ExperienceLevelsController.prototype, "findOne", null);
__decorate([
    (0, common_1.Put)(':experience_level_id'),
    (0, swagger_1.ApiConsumes)('multipart/form-data'),
    (0, swagger_1.ApiConsumes)('application/json'),
    (0, swagger_1.ApiBearerAuth)('access-token'),
    (0, common_1.UseGuards)(new jwt_auth_guard_1.JwtAuthGuard(['superadmin'])),
    (0, swagger_1.ApiOperation)({ summary: 'Update a experience level' }),
    __param(0, (0, common_1.Param)('experience_level_id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, update_experience_level_dto_1.UpdateExperienceLevelDto]),
    __metadata("design:returntype", void 0)
], ExperienceLevelsController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':experience_level_id'),
    (0, swagger_1.ApiConsumes)('multipart/form-data'),
    (0, swagger_1.ApiConsumes)('application/json'),
    (0, swagger_1.ApiBearerAuth)('access-token'),
    (0, common_1.UseGuards)(new jwt_auth_guard_1.JwtAuthGuard(['superadmin'])),
    (0, swagger_1.ApiOperation)({ summary: 'Delete a experience level' }),
    __param(0, (0, common_1.Param)('experience_level_id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], ExperienceLevelsController.prototype, "remove", null);
exports.ExperienceLevelsController = ExperienceLevelsController = __decorate([
    (0, swagger_1.ApiTags)('experience-levels'),
    (0, common_1.Controller)('experience-levels'),
    __metadata("design:paramtypes", [experience_levels_service_1.ExperienceLevelsService])
], ExperienceLevelsController);
//# sourceMappingURL=experience-levels.controller.js.map