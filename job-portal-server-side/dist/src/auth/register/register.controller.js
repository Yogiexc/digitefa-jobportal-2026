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
exports.RegisterController = void 0;
const common_1 = require("@nestjs/common");
const register_service_1 = require("./register.service");
const register_job_seeker_dto_1 = require("./dto/register-job-seeker.dto");
const swagger_1 = require("@nestjs/swagger");
const verify_otp_dto_1 = require("./dto/verify-otp.dto");
const register_university_dto_1 = require("./dto/register-university.dto");
const register_company_dto_1 = require("./dto/register-company.dto");
let RegisterController = class RegisterController {
    constructor(registerService) {
        this.registerService = registerService;
    }
    registerJobSeeker(registerJobSeekerDto) {
        return this.registerService.registerJobSeeker(registerJobSeekerDto);
    }
    registerCompany(registerCompanyDto) {
        return this.registerService.registerCompany(registerCompanyDto);
    }
    registerUniversity(registerUniversityDto) {
        return this.registerService.registerUniversity(registerUniversityDto);
    }
    async verifyOtp(verifyOtpDto) {
        return this.registerService.verifyOtp(verifyOtpDto.email, verifyOtpDto.otp);
    }
};
exports.RegisterController = RegisterController;
__decorate([
    (0, common_1.Post)('job-seeker'),
    (0, swagger_1.ApiConsumes)('multipart/form-data'),
    (0, swagger_1.ApiConsumes)('application/json'),
    (0, swagger_1.ApiOperation)({ summary: 'Register a job seeker' }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [register_job_seeker_dto_1.RegisterJobSeekerDto]),
    __metadata("design:returntype", void 0)
], RegisterController.prototype, "registerJobSeeker", null);
__decorate([
    (0, common_1.Post)('company'),
    (0, swagger_1.ApiConsumes)('multipart/form-data'),
    (0, swagger_1.ApiConsumes)('application/json'),
    (0, swagger_1.ApiOperation)({ summary: 'Register a company' }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [register_company_dto_1.RegisterCompanyDto]),
    __metadata("design:returntype", void 0)
], RegisterController.prototype, "registerCompany", null);
__decorate([
    (0, common_1.Post)('university'),
    (0, swagger_1.ApiConsumes)('multipart/form-data'),
    (0, swagger_1.ApiConsumes)('application/json'),
    (0, swagger_1.ApiOperation)({ summary: 'Register a university' }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [register_university_dto_1.RegisterUniversityDto]),
    __metadata("design:returntype", void 0)
], RegisterController.prototype, "registerUniversity", null);
__decorate([
    (0, common_1.Post)('verify-otp'),
    (0, swagger_1.ApiConsumes)('multipart/form-data'),
    (0, swagger_1.ApiConsumes)('application/json'),
    (0, swagger_1.ApiOperation)({ summary: 'Verify OTP' }),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [verify_otp_dto_1.VerifyOTPDto]),
    __metadata("design:returntype", Promise)
], RegisterController.prototype, "verifyOtp", null);
exports.RegisterController = RegisterController = __decorate([
    (0, swagger_1.ApiTags)('auth-register'),
    (0, common_1.Controller)('auth/register'),
    __metadata("design:paramtypes", [register_service_1.RegisterService])
], RegisterController);
//# sourceMappingURL=register.controller.js.map