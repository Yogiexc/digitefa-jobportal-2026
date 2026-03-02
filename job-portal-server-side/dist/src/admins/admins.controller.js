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
exports.AdminsController = void 0;
const common_1 = require("@nestjs/common");
const admins_service_1 = require("./admins.service");
const swagger_1 = require("@nestjs/swagger");
const create_admins_dto_1 = require("./dto/create-admins.dto");
const update_admins_dto_1 = require("./dto/update-admins.dto");
const jwt_auth_guard_1 = require("../auth/jwt-auth.guard");
let AdminsController = class AdminsController {
    constructor(adminsService) {
        this.adminsService = adminsService;
    }
    create(req, createAdminDto) {
        return this.adminsService.create(req.user, createAdminDto);
    }
    findAll(page, pageSize, search, sortBy, sortOrder) {
        return this.adminsService.findAll({ page, pageSize, search, sortBy, sortOrder });
    }
    findOne(admin_id) {
        return this.adminsService.findOne(admin_id);
    }
    update(req, admin_id, updateAdminDto) {
        return this.adminsService.update(req.user, admin_id, updateAdminDto);
    }
    remove(req, admin_id) {
        return this.adminsService.remove(req.user, admin_id);
    }
};
exports.AdminsController = AdminsController;
__decorate([
    (0, common_1.Post)(),
    (0, swagger_1.ApiConsumes)('multipart/form-data'),
    (0, swagger_1.ApiConsumes)('application/json'),
    (0, swagger_1.ApiBearerAuth)('access-token'),
    (0, common_1.UseGuards)(new jwt_auth_guard_1.JwtAuthGuard(['superadmin'])),
    (0, swagger_1.ApiOperation)({ summary: 'Create a admin' }),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, create_admins_dto_1.CreateAdminDto]),
    __metadata("design:returntype", void 0)
], AdminsController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(),
    (0, swagger_1.ApiBearerAuth)('access-token'),
    (0, common_1.UseGuards)(new jwt_auth_guard_1.JwtAuthGuard(['superadmin'])),
    (0, swagger_1.ApiOperation)({ summary: 'List all admin' }),
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
], AdminsController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)(':admin_id'),
    (0, swagger_1.ApiBearerAuth)('access-token'),
    (0, common_1.UseGuards)(new jwt_auth_guard_1.JwtAuthGuard(['superadmin'])),
    (0, swagger_1.ApiOperation)({ summary: 'Get a admin' }),
    __param(0, (0, common_1.Param)('admin_id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], AdminsController.prototype, "findOne", null);
__decorate([
    (0, common_1.Put)(':admin_id'),
    (0, swagger_1.ApiConsumes)('multipart/form-data'),
    (0, swagger_1.ApiConsumes)('application/json'),
    (0, swagger_1.ApiBearerAuth)('access-token'),
    (0, common_1.UseGuards)(new jwt_auth_guard_1.JwtAuthGuard(['superadmin'])),
    (0, swagger_1.ApiOperation)({ summary: 'Update a admin' }),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Param)('admin_id')),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, update_admins_dto_1.UpdateAdminDto]),
    __metadata("design:returntype", void 0)
], AdminsController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':admin_id'),
    (0, swagger_1.ApiBearerAuth)('access-token'),
    (0, common_1.UseGuards)(new jwt_auth_guard_1.JwtAuthGuard(['superadmin'])),
    (0, swagger_1.ApiOperation)({ summary: 'Delete a admin' }),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Param)('admin_id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", void 0)
], AdminsController.prototype, "remove", null);
exports.AdminsController = AdminsController = __decorate([
    (0, swagger_1.ApiTags)('admins'),
    (0, common_1.Controller)('admins'),
    __metadata("design:paramtypes", [admins_service_1.AdminsService])
], AdminsController);
//# sourceMappingURL=admins.controller.js.map