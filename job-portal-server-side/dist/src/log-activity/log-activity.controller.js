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
exports.LogActivityController = void 0;
const common_1 = require("@nestjs/common");
const log_activity_service_1 = require("./log-activity.service");
const swagger_1 = require("@nestjs/swagger");
const jwt_auth_guard_1 = require("../auth/jwt-auth.guard");
let LogActivityController = class LogActivityController {
    constructor(logActivityService) {
        this.logActivityService = logActivityService;
    }
    findAll(page, pageSize, search, sortBy, sortOrder) {
        return this.logActivityService.findAll({ page, pageSize, search, sortBy, sortOrder });
    }
};
exports.LogActivityController = LogActivityController;
__decorate([
    (0, common_1.Get)(),
    (0, swagger_1.ApiBearerAuth)('access-token'),
    (0, common_1.UseGuards)(new jwt_auth_guard_1.JwtAuthGuard(['superadmin'])),
    (0, swagger_1.ApiOperation)({ summary: 'List all log activity' }),
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
], LogActivityController.prototype, "findAll", null);
exports.LogActivityController = LogActivityController = __decorate([
    (0, swagger_1.ApiTags)('log-activity'),
    (0, swagger_1.ApiExcludeController)(),
    (0, common_1.Controller)('log-activity'),
    __metadata("design:paramtypes", [log_activity_service_1.LogActivityService])
], LogActivityController);
//# sourceMappingURL=log-activity.controller.js.map