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
exports.PositionLevelsController = void 0;
const common_1 = require("@nestjs/common");
const position_levels_service_1 = require("./position-levels.service");
const create_position_level_dto_1 = require("./dto/create-position-level.dto");
const update_position_level_dto_1 = require("./dto/update-position-level.dto");
const swagger_1 = require("@nestjs/swagger");
const jwt_auth_guard_1 = require("../../auth/jwt-auth.guard");
let PositionLevelsController = class PositionLevelsController {
    constructor(positionLevelsService) {
        this.positionLevelsService = positionLevelsService;
    }
    create(createPositionLevelDto) {
        return this.positionLevelsService.create(createPositionLevelDto);
    }
    findAll(page, pageSize, search, sortBy, sortOrder) {
        return this.positionLevelsService.findAll({ page, pageSize, search, sortBy, sortOrder });
    }
    findOne(position_level_id) {
        return this.positionLevelsService.findOne(position_level_id);
    }
    update(position_level_id, updatePositionLevelDto) {
        return this.positionLevelsService.update(position_level_id, updatePositionLevelDto);
    }
    remove(position_level_id) {
        return this.positionLevelsService.remove(position_level_id);
    }
};
exports.PositionLevelsController = PositionLevelsController;
__decorate([
    (0, common_1.Post)(),
    (0, swagger_1.ApiConsumes)('multipart/form-data'),
    (0, swagger_1.ApiConsumes)('application/json'),
    (0, swagger_1.ApiBearerAuth)('access-token'),
    (0, common_1.UseGuards)(new jwt_auth_guard_1.JwtAuthGuard(['superadmin'])),
    (0, swagger_1.ApiOperation)({ summary: 'Create a position level' }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_position_level_dto_1.CreatePositionLevelDto]),
    __metadata("design:returntype", void 0)
], PositionLevelsController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(),
    (0, swagger_1.ApiOperation)({ summary: 'List all position level' }),
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
], PositionLevelsController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)(':position_level_id'),
    (0, swagger_1.ApiBearerAuth)('access-token'),
    (0, common_1.UseGuards)(new jwt_auth_guard_1.JwtAuthGuard(['superadmin'])),
    (0, swagger_1.ApiOperation)({ summary: 'Get a position level' }),
    __param(0, (0, common_1.Param)('position_level_id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], PositionLevelsController.prototype, "findOne", null);
__decorate([
    (0, common_1.Put)(':position_level_id'),
    (0, swagger_1.ApiConsumes)('multipart/form-data'),
    (0, swagger_1.ApiConsumes)('application/json'),
    (0, swagger_1.ApiBearerAuth)('access-token'),
    (0, common_1.UseGuards)(new jwt_auth_guard_1.JwtAuthGuard(['superadmin'])),
    (0, swagger_1.ApiOperation)({ summary: 'Update a position level' }),
    __param(0, (0, common_1.Param)('position_level_id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, update_position_level_dto_1.UpdatePositionLevelDto]),
    __metadata("design:returntype", void 0)
], PositionLevelsController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':position_level_id'),
    (0, swagger_1.ApiConsumes)('multipart/form-data'),
    (0, swagger_1.ApiConsumes)('application/json'),
    (0, swagger_1.ApiBearerAuth)('access-token'),
    (0, common_1.UseGuards)(new jwt_auth_guard_1.JwtAuthGuard(['superadmin'])),
    (0, swagger_1.ApiOperation)({ summary: 'Delete a position level' }),
    __param(0, (0, common_1.Param)('position_level_id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], PositionLevelsController.prototype, "remove", null);
exports.PositionLevelsController = PositionLevelsController = __decorate([
    (0, swagger_1.ApiTags)('position-levels'),
    (0, common_1.Controller)('position-levels'),
    __metadata("design:paramtypes", [position_levels_service_1.PositionLevelsService])
], PositionLevelsController);
//# sourceMappingURL=position-levels.controller.js.map