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
exports.UniversityProfileService = void 0;
const common_1 = require("@nestjs/common");
const class_validator_1 = require("class-validator");
const prisma_service_1 = require("../../../prisma/prisma.service");
const fs = require("fs");
const path_1 = require("path");
let UniversityProfileService = class UniversityProfileService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async findOne(user) {
        const university = await this.prisma.universities.findUnique({
            where: { university_id: user.university_id },
            include: { university_detail: true }
        });
        const detailUniversity = Object.fromEntries(Object.entries(university).filter(([key]) => !['otp', 'otpExpires', 'password'].includes(key)));
        return {
            status: "success",
            message: 'University Profile retrieved successfully',
            data: detailUniversity
        };
    }
    async newUniversity(user, updateUniversityProfileDto, upload_logo) {
        const errors = await (0, class_validator_1.validate)(updateUniversityProfileDto);
        if (errors.length > 0) {
            throw new common_1.BadRequestException(errors);
        }
        const existingUniversity = await this.prisma.universities.findUnique({
            where: { university_id: user.university_id },
            include: { university_detail: true }
        });
        if (existingUniversity.status == 'submitted') {
            await fs.promises.unlink(upload_logo.path);
            throw new common_1.BadRequestException('University already submitted. Please wait for approval.');
        }
        else if (existingUniversity.status == 'accepted') {
            await fs.promises.unlink(upload_logo.path);
            throw new common_1.BadRequestException('University already accepted. No need to submit again.');
        }
        const currentLogoUrl = existingUniversity.university_detail?.logo_url;
        try {
            if (upload_logo && currentLogoUrl) {
                const oldFilePath = (0, path_1.join)(currentLogoUrl);
                if (fs.existsSync(oldFilePath)) {
                    try {
                        await fs.promises.unlink(oldFilePath);
                    }
                    catch (error) {
                    }
                }
                else {
                }
            }
            await this.prisma.universities.update({
                where: { university_id: user.university_id },
                data: {
                    status: 'submitted',
                    university_detail: {
                        update: { ...updateUniversityProfileDto, logo_url: upload_logo?.path }
                    },
                },
            });
            return {
                status: "success",
                message: 'Request university approval submitted successfully. Please wait for approval. Please check your email for information on the approval status.',
            };
        }
        catch (error) {
            console.log(error);
            throw new common_1.InternalServerErrorException('Failed to submit university profile for approval');
        }
    }
    async update(user, updateUniversityProfileDto, upload_logo) {
        const errors = await (0, class_validator_1.validate)(updateUniversityProfileDto);
        if (errors.length > 0) {
            throw new common_1.BadRequestException(errors);
        }
        const existingUniversity = await this.prisma.universities.findUnique({
            where: { university_id: user.university_id },
            include: { university_detail: true }
        });
        if (existingUniversity.status == 'submitted' || existingUniversity.status == 'not_submitted') {
            await fs.promises.unlink(upload_logo.path);
            throw new common_1.BadRequestException('University not yet accepted or rejected. Please wait for approval checking before update profile.');
        }
        const currentLogoUrl = existingUniversity.university_detail?.logo_url;
        try {
            if (upload_logo && currentLogoUrl) {
                const oldFilePath = (0, path_1.join)(currentLogoUrl);
                if (fs.existsSync(oldFilePath)) {
                    try {
                        await fs.promises.unlink(oldFilePath);
                    }
                    catch (error) {
                    }
                }
                else {
                }
            }
            const updatedUniversity = await this.prisma.universities.update({
                where: { university_id: user.university_id },
                data: {
                    university_detail: {
                        update: { ...updateUniversityProfileDto, logo_url: upload_logo?.path }
                    },
                },
            });
            return {
                status: "success",
                message: 'University Profile updated successfully',
                data: updatedUniversity
            };
        }
        catch (error) {
            throw new common_1.InternalServerErrorException('Failed to update university');
        }
    }
};
exports.UniversityProfileService = UniversityProfileService;
exports.UniversityProfileService = UniversityProfileService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], UniversityProfileService);
//# sourceMappingURL=university-profile.service.js.map