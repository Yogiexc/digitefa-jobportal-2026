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
exports.UniversityProfileController = void 0;
const common_1 = require("@nestjs/common");
const university_profile_service_1 = require("./university-profile.service");
const update_university_profile_dto_1 = require("./dto/update-university-profile.dto");
const swagger_1 = require("@nestjs/swagger");
const multer_1 = require("multer");
const platform_express_1 = require("@nestjs/platform-express");
const path_1 = require("path");
const jwt_auth_guard_1 = require("../../auth/jwt-auth.guard");
let UniversityProfileController = class UniversityProfileController {
    constructor(universityProfileService) {
        this.universityProfileService = universityProfileService;
    }
    findOne(req) {
        return this.universityProfileService.findOne(req.user);
    }
    newUniversity(req, updateUniversityProfileDto, upload_logo) {
        const update = Object.fromEntries(Object.entries(updateUniversityProfileDto).filter(([key]) => !['upload_logo'].includes(key)));
        return this.universityProfileService.newUniversity(req.user, update, upload_logo);
    }
    update(req, updateUniversityProfileDto, upload_logo) {
        const update = Object.fromEntries(Object.entries(updateUniversityProfileDto).filter(([key]) => !['upload_logo'].includes(key)));
        return this.universityProfileService.update(req.user, update, upload_logo);
    }
};
exports.UniversityProfileController = UniversityProfileController;
__decorate([
    (0, common_1.Get)(),
    (0, swagger_1.ApiBearerAuth)('access-token'),
    (0, common_1.UseGuards)(new jwt_auth_guard_1.JwtAuthGuard(['university'])),
    (0, swagger_1.ApiOperation)({ summary: 'Get a university profile' }),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], UniversityProfileController.prototype, "findOne", null);
__decorate([
    (0, common_1.Post)(),
    (0, swagger_1.ApiConsumes)('application/json'),
    (0, swagger_1.ApiConsumes)('multipart/form-data'),
    (0, swagger_1.ApiBearerAuth)('access-token'),
    (0, common_1.UseGuards)(new jwt_auth_guard_1.JwtAuthGuard(['university'])),
    (0, swagger_1.ApiOperation)({ summary: 'Request new university' }),
    (0, common_1.UseInterceptors)((0, platform_express_1.FileInterceptor)('upload_logo', {
        storage: (0, multer_1.diskStorage)({
            destination: './public/uploads/logo',
            filename: (req, file, cb) => {
                const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
                const ext = (0, path_1.extname)(file.originalname);
                const filename = `logo-university-${uniqueSuffix}${ext}`;
                cb(null, filename);
            },
        }),
        fileFilter: (req, file, cb) => {
            if (!file.mimetype.match(/\/(jpg|jpeg|png|gif)$/)) {
                cb(new common_1.BadRequestException('Only image files are allowed!'), false);
            }
            else {
                cb(null, true);
            }
        },
    })),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.UploadedFile)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, update_university_profile_dto_1.UpdateUniversityProfileDto, Object]),
    __metadata("design:returntype", void 0)
], UniversityProfileController.prototype, "newUniversity", null);
__decorate([
    (0, common_1.Put)(),
    (0, swagger_1.ApiConsumes)('application/json'),
    (0, swagger_1.ApiConsumes)('multipart/form-data'),
    (0, swagger_1.ApiBearerAuth)('access-token'),
    (0, common_1.UseGuards)(new jwt_auth_guard_1.JwtAuthGuard(['university'])),
    (0, swagger_1.ApiOperation)({ summary: 'Update a university profile' }),
    (0, common_1.UseInterceptors)((0, platform_express_1.FileInterceptor)('upload_logo', {
        storage: (0, multer_1.diskStorage)({
            destination: './public/uploads/logo',
            filename: (req, file, cb) => {
                const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
                const ext = (0, path_1.extname)(file.originalname);
                const filename = `logo-university-${uniqueSuffix}${ext}`;
                cb(null, filename);
            },
        }),
        fileFilter: (req, file, cb) => {
            if (!file.mimetype.match(/\/(jpg|jpeg|png|gif)$/)) {
                cb(new common_1.BadRequestException('Only image files are allowed!'), false);
            }
            else {
                cb(null, true);
            }
        },
    })),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.UploadedFile)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, update_university_profile_dto_1.UpdateUniversityProfileDto, Object]),
    __metadata("design:returntype", void 0)
], UniversityProfileController.prototype, "update", null);
exports.UniversityProfileController = UniversityProfileController = __decorate([
    (0, swagger_1.ApiTags)('university-profile'),
    (0, common_1.Controller)('profile/university'),
    __metadata("design:paramtypes", [university_profile_service_1.UniversityProfileService])
], UniversityProfileController);
//# sourceMappingURL=university-profile.controller.js.map