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
exports.CreateJobDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
const job_category_enum_1 = require("./job-category.enum");
class CreateJobDto {
}
exports.CreateJobDto = CreateJobDto;
__decorate([
    (0, class_validator_1.IsString)(),
    (0, swagger_1.ApiProperty)({
        type: String,
        description: 'This is a required property',
        default: 'Job Title',
    }),
    __metadata("design:type", String)
], CreateJobDto.prototype, "title", void 0);
__decorate([
    (0, class_validator_1.IsEnum)(job_category_enum_1.JobCategory),
    (0, swagger_1.ApiProperty)({
        enum: job_category_enum_1.JobCategory,
        description: 'This is a required property',
        default: job_category_enum_1.JobCategory.information_and_communication_technology,
    }),
    __metadata("design:type", String)
], CreateJobDto.prototype, "category", void 0);
__decorate([
    (0, class_validator_1.IsEnum)(['full_time', 'freelance', 'internship']),
    (0, swagger_1.ApiProperty)({
        enum: ['full_time', 'freelance', 'internship'],
        description: 'This is a required property',
        default: 'full_time',
    }),
    __metadata("design:type", String)
], CreateJobDto.prototype, "employment_type", void 0);
__decorate([
    (0, class_validator_1.IsEnum)(['on_site', 'remote', 'hybrid']),
    (0, swagger_1.ApiProperty)({
        enum: ['on_site', 'remote', 'hybrid'],
        description: 'This is a required property',
        default: 'on_site',
    }),
    __metadata("design:type", String)
], CreateJobDto.prototype, "work_type", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, swagger_1.ApiProperty)({
        type: String,
        description: 'This is a required property',
        default: 'Job Description',
    }),
    __metadata("design:type", String)
], CreateJobDto.prototype, "description", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, swagger_1.ApiProperty)({
        type: String,
        description: 'This is a required property',
        default: 'Location',
    }),
    __metadata("design:type", String)
], CreateJobDto.prototype, "location", void 0);
__decorate([
    (0, class_validator_1.IsEnum)(['monthly_based', 'project_based']),
    (0, swagger_1.ApiProperty)({
        enum: ['monthly_based', 'project_based'],
        description: 'This is a required property',
        default: 'monthly_based',
    }),
    __metadata("design:type", String)
], CreateJobDto.prototype, "salary_type", void 0);
__decorate([
    (0, class_validator_1.IsInt)(),
    (0, swagger_1.ApiProperty)({
        type: Number,
        description: 'This is a required property',
        default: 500000,
    }),
    __metadata("design:type", Number)
], CreateJobDto.prototype, "minimum_salary", void 0);
__decorate([
    (0, class_validator_1.IsInt)(),
    (0, swagger_1.ApiProperty)({
        type: Number,
        description: 'This is a required property',
        default: 1000000,
    }),
    __metadata("design:type", Number)
], CreateJobDto.prototype, "maximum_salary", void 0);
__decorate([
    (0, class_validator_1.IsEnum)([true, false]),
    (0, swagger_1.ApiProperty)({
        enum: [true, false],
        description: 'This is a required property',
        default: 'true',
    }),
    __metadata("design:type", String)
], CreateJobDto.prototype, "hide_salary", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, swagger_1.ApiProperty)({
        type: String,
        description: 'This is a required property',
        default: 'Education Requirement',
    }),
    __metadata("design:type", String)
], CreateJobDto.prototype, "education_requirement", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, swagger_1.ApiProperty)({
        type: String,
        description: 'This is a required property',
        default: 'Experience Requirement',
    }),
    __metadata("design:type", String)
], CreateJobDto.prototype, "experience_requirement", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, swagger_1.ApiProperty)({
        type: String,
        description: 'This is a required property',
        default: 'Skills Category',
    }),
    __metadata("design:type", String)
], CreateJobDto.prototype, "skills_category", void 0);
__decorate([
    (0, class_validator_1.IsArray)(),
    (0, swagger_1.ApiProperty)({
        type: String,
        description: 'This is a required property',
        default: ['Skills1', 'Skills2', 'Skills3', 'Skills4'],
    }),
    __metadata("design:type", Array)
], CreateJobDto.prototype, "skills_requirement", void 0);
__decorate([
    (0, class_validator_1.IsArray)(),
    (0, swagger_1.ApiProperty)({
        type: String,
        description: 'This is a required property',
        default: ['Benefits1', 'Benefits2', 'Benefits3', 'Benefits4'],
    }),
    __metadata("design:type", Array)
], CreateJobDto.prototype, "benefits", void 0);
__decorate([
    (0, class_validator_1.IsEnum)(['active', 'draft']),
    (0, swagger_1.ApiProperty)({
        enum: ['active', 'draft'],
        description: 'This is a required property',
        default: 'active',
    }),
    __metadata("design:type", String)
], CreateJobDto.prototype, "status", void 0);
//# sourceMappingURL=create-job.dto.js.map