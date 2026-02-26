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
exports.CreateExperienceDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
class CreateExperienceDto {
}
exports.CreateExperienceDto = CreateExperienceDto;
__decorate([
    (0, class_validator_1.IsString)(),
    (0, swagger_1.ApiProperty)({
        type: 'string',
        description: 'This is a required property',
        default: "Experience Title",
    }),
    __metadata("design:type", String)
], CreateExperienceDto.prototype, "experience_title", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, swagger_1.ApiProperty)({
        required: false,
        enum: ['full_time', 'part_time', 'contract', 'internship', 'volunteer', 'remote', 'freelance'],
        description: 'This is a optional property',
        default: "full_time",
    }),
    __metadata("design:type", String)
], CreateExperienceDto.prototype, "employment_type", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, swagger_1.ApiProperty)({
        type: 'string',
        description: 'This is a optional property',
        default: "Company Name",
    }),
    __metadata("design:type", String)
], CreateExperienceDto.prototype, "company_name", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, swagger_1.ApiProperty)({
        type: 'string',
        description: 'This is a optional property',
        default: "Location",
    }),
    __metadata("design:type", String)
], CreateExperienceDto.prototype, "location", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, swagger_1.ApiProperty)({
        type: 'string',
        description: 'This is a optional property',
        default: "Onsite",
    }),
    __metadata("design:type", String)
], CreateExperienceDto.prototype, "location_type", void 0);
__decorate([
    (0, class_validator_1.MaxLength)(255, {
        message: 'Description is too long (255 characters max)',
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, swagger_1.ApiProperty)({
        type: 'string',
        description: 'This is a optional property',
        default: "Description",
    }),
    __metadata("design:type", String)
], CreateExperienceDto.prototype, "description", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, swagger_1.ApiProperty)({
        type: 'string',
        description: 'This is a required property',
        default: "2021-09",
    }),
    __metadata("design:type", String)
], CreateExperienceDto.prototype, "start_date", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, swagger_1.ApiProperty)({
        type: 'string',
        description: 'This is a required property',
        default: "2025-09",
    }),
    __metadata("design:type", String)
], CreateExperienceDto.prototype, "end_date", void 0);
//# sourceMappingURL=create-experience.dto.js.map