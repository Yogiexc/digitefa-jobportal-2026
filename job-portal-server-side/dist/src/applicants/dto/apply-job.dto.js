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
Object.defineProperty(exports, "__esModule", { value: true });
exports.ApplyJobDto = void 0;
const swagger_1 = require("@nestjs/swagger");
class ApplyJobDto {
}
exports.ApplyJobDto = ApplyJobDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        type: 'string',
        format: 'binary',
        description: 'Upload CV file (jpg, jpeg, png, pdf)',
        default: 'File CV',
    }),
    __metadata("design:type", Object)
], ApplyJobDto.prototype, "upload_resume", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        type: 'string',
        description: 'Expected Salary',
        default: '10000000',
    }),
    __metadata("design:type", String)
], ApplyJobDto.prototype, "expected_salary", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        type: 'string',
        description: 'Experience Years',
        default: '2',
    }),
    __metadata("design:type", String)
], ApplyJobDto.prototype, "experience_years", void 0);
//# sourceMappingURL=apply-job.dto.js.map