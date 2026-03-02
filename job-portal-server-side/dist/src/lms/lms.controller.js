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
exports.LmsController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const lms_service_1 = require("./lms.service");
const link_lms_account_dto_1 = require("./dto/link-lms-account.dto");
const passport_1 = require("@nestjs/passport");
const api_key_guard_1 = require("../auth/guards/api-key.guard");
const validate_job_portal_account_dto_1 = require("./dto/validate-job-portal-account.dto");
const unlink_job_portal_account_dto_1 = require("./dto/unlink-job-portal-account.dto");
const swagger_2 = require("@nestjs/swagger");
let LmsController = class LmsController {
    constructor(lmsService) {
        this.lmsService = lmsService;
    }
    async unlinkByLmsCommand(body) {
        await this.lmsService.unlinkFromLmsCommand(body);
        return {
            message: 'Job Portal account unlinked successfully.',
        };
    }
    async validateAndLinkFromLms(body) {
        const result = await this.lmsService.validateAndLinkJobPortalAccount(body);
        return {
            message: 'Job Portal account validated and linked successfully.',
            data: result,
        };
    }
    getJobs() {
        return this.lmsService.getJobs();
    }
    async linkAccount(body, req) {
        const { email, password } = body;
        const jwtPayload = req.user;
        console.log('[LmsController] JWT Payload from req.user:', jwtPayload);
        if (!jwtPayload) {
            console.error('[LmsController] Critical: req.user (JWT Payload) is undefined after AuthGuard.');
            throw new common_1.UnauthorizedException('Authentication token is invalid or missing.');
        }
        if (jwtPayload.role !== 'job_seeker') {
            console.warn(`[LmsController] Forbidden: User with role '${jwtPayload.role}' attempted to link LMS account.`);
            throw new common_1.ForbiddenException('This action is only allowed for job seekers.');
        }
        const jobSeekerId = jwtPayload.job_seeker_id;
        if (!jobSeekerId) {
            console.error('[LmsController] Critical: job_seeker_id is missing in JWT payload for job_seeker role.');
            throw new common_1.InternalServerErrorException('Job Seeker ID not found in token. Please re-login.');
        }
        console.log(`[LmsController] Attempting to validate LMS credentials for jobSeekerId: ${jobSeekerId}`);
        const lmsUserResponse = await this.lmsService.validateLmsCredentials(email, password, jobSeekerId);
        console.log('[LmsController] LMS User response from Laravel:', lmsUserResponse);
        if (!lmsUserResponse ||
            !lmsUserResponse.user ||
            typeof lmsUserResponse.user.id_user === 'undefined' ||
            lmsUserResponse.user.id_user === null) {
            console.error('[LmsController] Invalid LMS user data: `user` object or `user.id_user` missing/null from LMS response:', lmsUserResponse);
            throw new common_1.InternalServerErrorException('Failed to retrieve valid user ID from LMS.');
        }
        const lmsUserId = String(lmsUserResponse.user.id_user);
        console.log(`[LmsController] Linking account: jobSeekerId=${jobSeekerId}, lmsUserId=${lmsUserId}`);
        await this.lmsService.linkLmsAccount(jobSeekerId, lmsUserId);
        return { message: 'LMS account linked successfully.' };
    }
    async unlinkAccount(req) {
        const jwtPayload = req.user;
        console.log('[LmsController] JWT Payload from req.user:', jwtPayload);
        if (!jwtPayload) {
            console.error('[LmsController] Critical: req.user (JWT Payload) is undefined after AuthGuard.');
            throw new common_1.UnauthorizedException('Authentication token is invalid or missing.');
        }
        if (jwtPayload.role !== 'job_seeker') {
            console.warn(`[LmsController] Forbidden: User with role '${jwtPayload.role}' attempted to unlink LMS account.`);
            throw new common_1.ForbiddenException('This action is only allowed for job seekers.');
        }
        const jobSeekerId = jwtPayload.job_seeker_id;
        if (!jobSeekerId) {
            console.error('[LmsController] Critical: job_seeker_id is missing in JWT payload for job_seeker role.');
            throw new common_1.InternalServerErrorException('Job Seeker ID not found in token. Please re-login.');
        }
        console.log(`[LmsController] Attempting to unlink LMS account for jobSeekerId: ${jobSeekerId}`);
        await this.lmsService.unlinkLmsAccount(jobSeekerId);
        return { message: 'LMS account unlinked successfully.' };
    }
};
exports.LmsController = LmsController;
__decorate([
    (0, common_1.Post)('unlink-from-lms'),
    (0, common_1.UseGuards)(api_key_guard_1.ApiKeyGuard),
    (0, swagger_1.ApiOperation)({ summary: 'Unlink Job Portal account by command from LMS (Server-to-Server)' }),
    (0, swagger_2.ApiHeader)({ name: 'X-API-KEY', description: 'API Key for server-to-server communication' }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [unlink_job_portal_account_dto_1.UnlinkJobPortalAccountDto]),
    __metadata("design:returntype", Promise)
], LmsController.prototype, "unlinkByLmsCommand", null);
__decorate([
    (0, common_1.Post)('validate-and-link-from-lms'),
    (0, common_1.UseGuards)(api_key_guard_1.ApiKeyGuard),
    (0, swagger_1.ApiOperation)({
        summary: 'Validate Job Portal credentials and link from LMS (Server-to-Server)',
    }),
    (0, swagger_2.ApiHeader)({
        name: 'X-API-KEY',
        description: 'API Key for server-to-server communication',
    }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [validate_job_portal_account_dto_1.ValidateJobPortalAccountDto]),
    __metadata("design:returntype", Promise)
], LmsController.prototype, "validateAndLinkFromLms", null);
__decorate([
    (0, common_1.Get)('jobs'),
    (0, swagger_1.ApiOperation)({ summary: 'List all jobs' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], LmsController.prototype, "getJobs", null);
__decorate([
    (0, common_1.Post)('link-account'),
    (0, common_1.UseGuards)((0, passport_1.AuthGuard)('jwt')),
    (0, swagger_1.ApiOperation)({ summary: 'Link LMS account to job seeker' }),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [link_lms_account_dto_1.LinkLmsAccountDto, Object]),
    __metadata("design:returntype", Promise)
], LmsController.prototype, "linkAccount", null);
__decorate([
    (0, common_1.Post)('unlink-account'),
    (0, common_1.UseGuards)((0, passport_1.AuthGuard)('jwt')),
    (0, swagger_1.ApiOperation)({ summary: 'Unlink LMS account from job seeker' }),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], LmsController.prototype, "unlinkAccount", null);
exports.LmsController = LmsController = __decorate([
    (0, swagger_1.ApiTags)('lms'),
    (0, common_1.Controller)('lms'),
    __metadata("design:paramtypes", [lms_service_1.LmsService])
], LmsController);
//# sourceMappingURL=lms.controller.js.map