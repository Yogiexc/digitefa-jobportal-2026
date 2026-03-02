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
exports.JobSeekerProfileController = void 0;
const common_1 = require("@nestjs/common");
const job_seeker_profile_service_1 = require("./job-seeker-profile.service");
const swagger_1 = require("@nestjs/swagger");
const platform_express_1 = require("@nestjs/platform-express");
const multer_1 = require("multer");
const path_1 = require("path");
const jwt_auth_guard_1 = require("../../auth/jwt-auth.guard");
const update_personal_info_dto_1 = require("./dto/update-personal-info.dto");
const update_personal_summary_dto_1 = require("./dto/update-personal-summary.dto");
const update_profile_picture_dto_1 = require("./dto/update-profile-picture.dto");
const update_education_dto_1 = require("./dto/update-education.dto");
let JobSeekerProfileController = class JobSeekerProfileController {
    constructor(jobSeekerProfileService) {
        this.jobSeekerProfileService = jobSeekerProfileService;
    }
    async getPersonalInfo(req) {
        return this.jobSeekerProfileService.getPersonalInfo(req.user);
    }
    async updateProfilePicture(req, uploadProfilePictureDto, profile_picture) {
        return this.jobSeekerProfileService.updateProfilePicture(req.user, profile_picture);
    }
    async updatePersonalInfo(req, updatePersonalInfoDto) {
        return this.jobSeekerProfileService.updatePersonalInfo(req.user, updatePersonalInfoDto);
    }
    async getPersonalSummary(req) {
        return this.jobSeekerProfileService.getPersonalSummary(req.user);
    }
    async updatePersonalSummary(req, updatePersonalSummaryDto) {
        return this.jobSeekerProfileService.updatePersonalSummary(req.user, updatePersonalSummaryDto);
    }
    async getEducation(req) {
        return this.jobSeekerProfileService.getEducation(req.user);
    }
    async updateEducation(req, updateEducationDto) {
        return this.jobSeekerProfileService.updateEducation(req.user, updateEducationDto);
    }
};
exports.JobSeekerProfileController = JobSeekerProfileController;
__decorate([
    (0, swagger_1.ApiTags)('job-seeker-profile'),
    (0, common_1.Get)('personal-info'),
    (0, swagger_1.ApiBearerAuth)('access-token'),
    (0, common_1.UseGuards)(new jwt_auth_guard_1.JwtAuthGuard(['job_seeker'])),
    (0, swagger_1.ApiOperation)({ summary: 'Get a job seeker personal information' }),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], JobSeekerProfileController.prototype, "getPersonalInfo", null);
__decorate([
    (0, swagger_1.ApiTags)('job-seeker-profile'),
    (0, swagger_1.ApiConsumes)('application/json'),
    (0, swagger_1.ApiConsumes)('multipart/form-data'),
    (0, common_1.Post)('profile-picture'),
    (0, swagger_1.ApiBearerAuth)('access-token'),
    (0, common_1.UseGuards)(new jwt_auth_guard_1.JwtAuthGuard(['job_seeker'])),
    (0, swagger_1.ApiOperation)({ summary: 'Update a job seeker profile picture' }),
    (0, common_1.UseInterceptors)((0, platform_express_1.FileInterceptor)('profile_picture', {
        storage: (0, multer_1.diskStorage)({
            destination: './public/uploads/profile-picture',
            filename: (req, file, cb) => {
                const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
                const ext = (0, path_1.extname)(file.originalname);
                const filename = `profile-picture-${uniqueSuffix}${ext}`;
                cb(null, filename);
            },
        }),
        fileFilter: (req, file, cb) => {
            if (!file.mimetype.match(/\/(jpg|jpeg|png)$/)) {
                cb(new common_1.BadRequestException('Only image (jpg, jpeg, png) files are allowed!'), false);
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
    __metadata("design:paramtypes", [Object, update_profile_picture_dto_1.UpdateProfilePictureDto, Object]),
    __metadata("design:returntype", Promise)
], JobSeekerProfileController.prototype, "updateProfilePicture", null);
__decorate([
    (0, swagger_1.ApiTags)('job-seeker-profile'),
    (0, common_1.Put)('personal-info'),
    (0, swagger_1.ApiConsumes)('multipart/form-data'),
    (0, swagger_1.ApiConsumes)('application/json'),
    (0, swagger_1.ApiBearerAuth)('access-token'),
    (0, common_1.UseGuards)(new jwt_auth_guard_1.JwtAuthGuard(['job_seeker'])),
    (0, swagger_1.ApiOperation)({ summary: 'Update a job seeker personal information' }),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, update_personal_info_dto_1.UpdatePersonalInfoDto]),
    __metadata("design:returntype", Promise)
], JobSeekerProfileController.prototype, "updatePersonalInfo", null);
__decorate([
    (0, swagger_1.ApiTags)('job-seeker-profile-personal-summary'),
    (0, common_1.Get)('personal-summary'),
    (0, swagger_1.ApiConsumes)('multipart/form-data'),
    (0, swagger_1.ApiConsumes)('application/json'),
    (0, swagger_1.ApiBearerAuth)('access-token'),
    (0, common_1.UseGuards)(new jwt_auth_guard_1.JwtAuthGuard(['job_seeker'])),
    (0, swagger_1.ApiOperation)({ summary: 'Get a job seeker personal summary' }),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], JobSeekerProfileController.prototype, "getPersonalSummary", null);
__decorate([
    (0, swagger_1.ApiTags)('job-seeker-profile-personal-summary'),
    (0, common_1.Put)('personal-summary'),
    (0, swagger_1.ApiConsumes)('multipart/form-data'),
    (0, swagger_1.ApiConsumes)('application/json'),
    (0, swagger_1.ApiBearerAuth)('access-token'),
    (0, common_1.UseGuards)(new jwt_auth_guard_1.JwtAuthGuard(['job_seeker'])),
    (0, swagger_1.ApiOperation)({ summary: 'Update a job seeker personal summary' }),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, update_personal_summary_dto_1.UpdatePersonalSummaryDto]),
    __metadata("design:returntype", Promise)
], JobSeekerProfileController.prototype, "updatePersonalSummary", null);
__decorate([
    (0, swagger_1.ApiTags)('job-seeker-profile-education'),
    (0, common_1.Get)('education'),
    (0, swagger_1.ApiConsumes)('multipart/form-data'),
    (0, swagger_1.ApiConsumes)('application/json'),
    (0, swagger_1.ApiBearerAuth)('access-token'),
    (0, common_1.UseGuards)(new jwt_auth_guard_1.JwtAuthGuard(['job_seeker'])),
    (0, swagger_1.ApiOperation)({ summary: 'Get education job seeker' }),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], JobSeekerProfileController.prototype, "getEducation", null);
__decorate([
    (0, swagger_1.ApiTags)('job-seeker-profile-education'),
    (0, common_1.Put)('education'),
    (0, swagger_1.ApiConsumes)('multipart/form-data'),
    (0, swagger_1.ApiConsumes)('application/json'),
    (0, swagger_1.ApiBearerAuth)('access-token'),
    (0, common_1.UseGuards)(new jwt_auth_guard_1.JwtAuthGuard(['job_seeker'])),
    (0, swagger_1.ApiOperation)({ summary: 'Update education job seeker' }),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, update_education_dto_1.UpdateEducationDto]),
    __metadata("design:returntype", Promise)
], JobSeekerProfileController.prototype, "updateEducation", null);
exports.JobSeekerProfileController = JobSeekerProfileController = __decorate([
    (0, common_1.Controller)('profile/job-seeker'),
    __metadata("design:paramtypes", [job_seeker_profile_service_1.JobSeekerProfileService])
], JobSeekerProfileController);
//# sourceMappingURL=job-seeker-profile.controller.js.map