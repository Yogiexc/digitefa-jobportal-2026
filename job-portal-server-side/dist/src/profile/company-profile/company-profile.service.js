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
exports.CompanyProfileService = void 0;
const common_1 = require("@nestjs/common");
const class_validator_1 = require("class-validator");
const prisma_service_1 = require("../../../prisma/prisma.service");
const fs = require("fs");
const path_1 = require("path");
let CompanyProfileService = class CompanyProfileService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async findOne(user) {
        const company = await this.prisma.companies.findUnique({
            where: { company_id: user.company_id },
            include: { company_detail: true }
        });
        const detailCompany = Object.fromEntries(Object.entries(company).filter(([key]) => !['otp', 'otpExpires', 'password'].includes(key)));
        return {
            status: "success",
            message: 'Company Profile retrieved successfully',
            data: detailCompany
        };
    }
    async newCompany(user, updateCompanyProfileDto, upload_logo) {
        const errors = await (0, class_validator_1.validate)(updateCompanyProfileDto);
        if (errors.length > 0) {
            throw new common_1.BadRequestException(errors);
        }
        const existingCompany = await this.prisma.companies.findUnique({
            where: { company_id: user.company_id },
            include: { company_detail: true }
        });
        if (existingCompany.status == 'submitted') {
            upload_logo ? await fs.promises.unlink(upload_logo.path) : null;
            throw new common_1.BadRequestException('Company already submitted. Please wait for approval.');
        }
        else if (existingCompany.status == 'accepted') {
            upload_logo ? await fs.promises.unlink(upload_logo.path) : null;
            throw new common_1.BadRequestException('Company already accepted. No need to submit again.');
        }
        const currentLogoUrl = existingCompany.company_detail?.logo_url;
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
            await this.prisma.companies.update({
                where: { company_id: user.company_id },
                data: {
                    status: 'submitted',
                    company_detail: {
                        upsert: {
                            update: { ...updateCompanyProfileDto, logo_url: upload_logo?.path }, create: { ...updateCompanyProfileDto, logo_url: upload_logo?.path },
                        },
                    },
                },
            });
            return {
                status: "success",
                message: 'Request company approval submitted successfully. Please wait for approval. Please check your email for information on the approval status.',
            };
        }
        catch (error) {
            console.log(error);
            throw new common_1.InternalServerErrorException('Failed to submit company profile for approval');
        }
    }
    async update(user, updateCompanyProfileDto, upload_logo) {
        const errors = await (0, class_validator_1.validate)(updateCompanyProfileDto);
        if (errors.length > 0) {
            throw new common_1.BadRequestException(errors);
        }
        const existingCompany = await this.prisma.companies.findUnique({
            where: { company_id: user.company_id },
            include: { company_detail: true }
        });
        if (existingCompany.status == 'submitted' || existingCompany.status == 'not_submitted') {
            upload_logo ? await fs.promises.unlink(upload_logo.path) : null;
            throw new common_1.BadRequestException('Company not yet accepted or rejected. Please wait for approval checking before update profile.');
        }
        const currentLogoUrl = existingCompany.company_detail?.logo_url;
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
            const updatedCompany = await this.prisma.companies.update({
                where: { company_id: user.company_id },
                data: {
                    company_detail: {
                        upsert: {
                            update: { ...updateCompanyProfileDto, logo_url: upload_logo?.path }, create: { ...updateCompanyProfileDto, logo_url: upload_logo?.path },
                        },
                    },
                },
            });
            return {
                status: "success",
                message: 'Company Profile updated successfully',
                data: updatedCompany
            };
        }
        catch (error) {
            throw new common_1.InternalServerErrorException('Failed to update company');
        }
    }
};
exports.CompanyProfileService = CompanyProfileService;
exports.CompanyProfileService = CompanyProfileService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], CompanyProfileService);
//# sourceMappingURL=company-profile.service.js.map