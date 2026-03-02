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
exports.LanguagesController = void 0;
const common_1 = require("@nestjs/common");
const languages_service_1 = require("./languages.service");
const create_language_dto_1 = require("./dto/create-language.dto");
const update_language_dto_1 = require("./dto/update-language.dto");
const swagger_1 = require("@nestjs/swagger");
const jwt_auth_guard_1 = require("../../../auth/jwt-auth.guard");
let LanguagesController = class LanguagesController {
    constructor(languagesService) {
        this.languagesService = languagesService;
    }
    getLanguages(req) {
        return this.languagesService.getLanguages(req.user);
    }
    getLanguage(language_id, req) {
        return this.languagesService.getLanguage(req.user, language_id);
    }
    addLanguages(req, createLanguageDto) {
        return this.languagesService.addLanguages(req.user, createLanguageDto);
    }
    updateLanguages(language_id, req, updateLanguageDto) {
        return this.languagesService.updateLanguages(req.user, language_id, updateLanguageDto);
    }
    deleteLanguages(language_id, req) {
        return this.languagesService.deleteLanguages(req.user, language_id);
    }
};
exports.LanguagesController = LanguagesController;
__decorate([
    (0, common_1.Get)(),
    (0, swagger_1.ApiBearerAuth)('access-token'),
    (0, common_1.UseGuards)(new jwt_auth_guard_1.JwtAuthGuard(['job_seeker'])),
    (0, swagger_1.ApiOperation)({ summary: 'Get all languages job seeker' }),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], LanguagesController.prototype, "getLanguages", null);
__decorate([
    (0, common_1.Get)('/:language_id'),
    (0, swagger_1.ApiBearerAuth)('access-token'),
    (0, common_1.UseGuards)(new jwt_auth_guard_1.JwtAuthGuard(['job_seeker'])),
    (0, swagger_1.ApiOperation)({ summary: 'Get language job seeker' }),
    __param(0, (0, common_1.Param)('language_id')),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], LanguagesController.prototype, "getLanguage", null);
__decorate([
    (0, common_1.Post)(),
    (0, swagger_1.ApiConsumes)('multipart/form-data'),
    (0, swagger_1.ApiConsumes)('application/json'),
    (0, swagger_1.ApiBearerAuth)('access-token'),
    (0, common_1.UseGuards)(new jwt_auth_guard_1.JwtAuthGuard(['job_seeker'])),
    (0, swagger_1.ApiOperation)({ summary: 'Add languages job seeker' }),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, create_language_dto_1.CreateLanguageDto]),
    __metadata("design:returntype", void 0)
], LanguagesController.prototype, "addLanguages", null);
__decorate([
    (0, common_1.Put)('/:language_id'),
    (0, swagger_1.ApiConsumes)('multipart/form-data'),
    (0, swagger_1.ApiConsumes)('application/json'),
    (0, swagger_1.ApiBearerAuth)('access-token'),
    (0, common_1.UseGuards)(new jwt_auth_guard_1.JwtAuthGuard(['job_seeker'])),
    (0, swagger_1.ApiOperation)({ summary: 'Update languages job seeker' }),
    __param(0, (0, common_1.Param)('language_id')),
    __param(1, (0, common_1.Request)()),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object, update_language_dto_1.UpdateLanguageDto]),
    __metadata("design:returntype", void 0)
], LanguagesController.prototype, "updateLanguages", null);
__decorate([
    (0, common_1.Delete)('/:language_id'),
    (0, swagger_1.ApiBearerAuth)('access-token'),
    (0, common_1.UseGuards)(new jwt_auth_guard_1.JwtAuthGuard(['job_seeker'])),
    (0, swagger_1.ApiOperation)({ summary: 'Delete language job seeker' }),
    __param(0, (0, common_1.Param)('language_id')),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], LanguagesController.prototype, "deleteLanguages", null);
exports.LanguagesController = LanguagesController = __decorate([
    (0, swagger_1.ApiTags)('job-seeker-profile-languages'),
    (0, common_1.Controller)('profile/job-seeker/languages'),
    __metadata("design:paramtypes", [languages_service_1.LanguagesService])
], LanguagesController);
//# sourceMappingURL=languages.controller.js.map