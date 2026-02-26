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
exports.CreateCertificationDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
class CreateCertificationDto {
}
exports.CreateCertificationDto = CreateCertificationDto;
__decorate([
    (0, class_validator_1.IsString)(),
    (0, swagger_1.ApiProperty)({
        type: 'string',
        description: 'This is a required property',
        default: "Certified Information Systems Security Professional (CISSP)",
    }),
    __metadata("design:type", String)
], CreateCertificationDto.prototype, "certification_name", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, swagger_1.ApiProperty)({
        type: 'string',
        description: 'This is a required property',
        default: "International Information System Security Certification Consortium (ISC)²",
    }),
    __metadata("design:type", String)
], CreateCertificationDto.prototype, "issuing_organization", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, swagger_1.ApiProperty)({
        type: 'string',
        description: 'This is a required property',
        default: '2021-09',
    }),
    __metadata("design:type", String)
], CreateCertificationDto.prototype, "issue_date", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, swagger_1.ApiProperty)({
        type: 'string',
        description: 'This is a required property',
        default: '2025-09',
    }),
    __metadata("design:type", String)
], CreateCertificationDto.prototype, "expiration_date", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, swagger_1.ApiProperty)({
        type: 'string',
        description: 'This is a required property',
        default: 'Credential URL',
    }),
    __metadata("design:type", String)
], CreateCertificationDto.prototype, "credential_url", void 0);
//# sourceMappingURL=create-certification.dto.js.map