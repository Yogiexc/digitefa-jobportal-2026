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
exports.LoginController = void 0;
const common_1 = require("@nestjs/common");
const login_service_1 = require("./login.service");
const swagger_1 = require("@nestjs/swagger");
const loginJobSeeker_dto_1 = require("./dto/loginJobSeeker.dto");
const loginCMS_dto_1 = require("./dto/loginCMS.dto");
const loginGoogle_dto_1 = require("./dto/loginGoogle.dto");
const ssoLms_dto_1 = require("./dto/ssoLms.dto");
let LoginController = class LoginController {
    constructor(loginService) {
        this.loginService = loginService;
    }
    async loginGoogle(loginGoogleDto) {
        return this.loginService.loginGoogle(loginGoogleDto.credential);
    }
    async ssoLms(ssoLmsDto) {
        return this.loginService.ssoLms(ssoLmsDto);
    }
    async loginJobSeeker(loginJobSeekerDto) {
        const user = await this.loginService.validateJobSeeker(loginJobSeekerDto);
        if (!user) {
            throw new common_1.UnauthorizedException('Invalid credentials');
        }
        return this.loginService.login(user);
    }
    async loginCMS(loginCMSDto) {
        const user = await this.loginService.validateCMS(loginCMSDto);
        if (!user) {
            throw new common_1.UnauthorizedException('Invalid credentials');
        }
        return this.loginService.login(user);
    }
};
exports.LoginController = LoginController;
__decorate([
    (0, common_1.Post)('google'),
    (0, swagger_1.ApiConsumes)('multipart/form-data'),
    (0, swagger_1.ApiConsumes)('application/json'),
    (0, swagger_1.ApiOperation)({ summary: 'Login with Google' }),
    (0, common_1.HttpCode)(200),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [loginGoogle_dto_1.LoginGoogleDto]),
    __metadata("design:returntype", Promise)
], LoginController.prototype, "loginGoogle", null);
__decorate([
    (0, common_1.Post)('sso-lms'),
    (0, swagger_1.ApiConsumes)('application/json'),
    (0, swagger_1.ApiOperation)({ summary: 'Login or Auto-Register from LMS via SSO' }),
    (0, common_1.HttpCode)(200),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [ssoLms_dto_1.SsoLmsDto]),
    __metadata("design:returntype", Promise)
], LoginController.prototype, "ssoLms", null);
__decorate([
    (0, common_1.Post)('job-seeker'),
    (0, swagger_1.ApiConsumes)('multipart/form-data'),
    (0, swagger_1.ApiConsumes)('application/json'),
    (0, swagger_1.ApiOperation)({ summary: 'Login as a job seeker' }),
    (0, common_1.HttpCode)(200),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [loginJobSeeker_dto_1.LoginJobSeekerDto]),
    __metadata("design:returntype", Promise)
], LoginController.prototype, "loginJobSeeker", null);
__decorate([
    (0, common_1.Post)('cms'),
    (0, swagger_1.ApiConsumes)('multipart/form-data'),
    (0, swagger_1.ApiConsumes)('application/json'),
    (0, swagger_1.ApiOperation)({ summary: 'Login CMS' }),
    (0, common_1.HttpCode)(200),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [loginCMS_dto_1.LoginCMSDto]),
    __metadata("design:returntype", Promise)
], LoginController.prototype, "loginCMS", null);
exports.LoginController = LoginController = __decorate([
    (0, swagger_1.ApiTags)('auth-login'),
    (0, common_1.Controller)('auth/login'),
    __metadata("design:paramtypes", [login_service_1.LoginService])
], LoginController);
//# sourceMappingURL=login.controller.js.map