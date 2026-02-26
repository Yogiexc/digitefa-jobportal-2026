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
exports.ForgotPasswordController = void 0;
const common_1 = require("@nestjs/common");
const forgot_password_service_1 = require("./forgot-password.service");
const forgot_password_dto_1 = require("./dto/forgot-password.dto");
const reset_password_dto_1 = require("./dto/reset-password.dto");
const swagger_1 = require("@nestjs/swagger");
const verify_otp_dto_1 = require("./dto/verify-otp.dto");
let ForgotPasswordController = class ForgotPasswordController {
    constructor(forgotPasswordService) {
        this.forgotPasswordService = forgotPasswordService;
    }
    async forgotPassword(forgotPasswordDto) {
        return this.forgotPasswordService.forgotPassword(forgotPasswordDto);
    }
    async verifyOtpForReset(verifyOtp) {
        return this.forgotPasswordService.verifyOtp(verifyOtp);
    }
    async resetPassword(resetPasswordDto) {
        return this.forgotPasswordService.resetPassword(resetPasswordDto);
    }
};
exports.ForgotPasswordController = ForgotPasswordController;
__decorate([
    (0, common_1.Post)('forgot-password'),
    (0, swagger_1.ApiConsumes)('multipart/form-data'),
    (0, swagger_1.ApiConsumes)('application/json'),
    (0, swagger_1.ApiOperation)({ summary: 'Forgot password' }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [forgot_password_dto_1.ForgotPasswordDto]),
    __metadata("design:returntype", Promise)
], ForgotPasswordController.prototype, "forgotPassword", null);
__decorate([
    (0, common_1.Post)('verify-otp-for-reset'),
    (0, swagger_1.ApiConsumes)('multipart/form-data'),
    (0, swagger_1.ApiConsumes)('application/json'),
    (0, swagger_1.ApiOperation)({ summary: 'Verify OTP for reset' }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [verify_otp_dto_1.VerifyOTPDto]),
    __metadata("design:returntype", Promise)
], ForgotPasswordController.prototype, "verifyOtpForReset", null);
__decorate([
    (0, common_1.Post)('reset-password'),
    (0, swagger_1.ApiConsumes)('multipart/form-data'),
    (0, swagger_1.ApiConsumes)('application/json'),
    (0, swagger_1.ApiOperation)({ summary: 'Reset password' }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [reset_password_dto_1.ResetPasswordDto]),
    __metadata("design:returntype", Promise)
], ForgotPasswordController.prototype, "resetPassword", null);
exports.ForgotPasswordController = ForgotPasswordController = __decorate([
    (0, swagger_1.ApiTags)('auth-forgot-password'),
    (0, common_1.Controller)('auth'),
    __metadata("design:paramtypes", [forgot_password_service_1.ForgotPasswordService])
], ForgotPasswordController);
//# sourceMappingURL=forgot-password.controller.js.map