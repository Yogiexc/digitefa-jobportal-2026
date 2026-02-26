"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.JobSeekerProfileModule = void 0;
const common_1 = require("@nestjs/common");
const job_seeker_profile_service_1 = require("./job-seeker-profile.service");
const job_seeker_profile_controller_1 = require("./job-seeker-profile.controller");
const prisma_module_1 = require("../../../prisma/prisma.module");
const certifications_module_1 = require("./certifications/certifications.module");
const projects_module_1 = require("./projects/projects.module");
const experience_module_1 = require("./experience/experience.module");
const languages_module_1 = require("./languages/languages.module");
const skills_module_1 = require("./skills/skills.module");
let JobSeekerProfileModule = class JobSeekerProfileModule {
};
exports.JobSeekerProfileModule = JobSeekerProfileModule;
exports.JobSeekerProfileModule = JobSeekerProfileModule = __decorate([
    (0, common_1.Module)({
        imports: [prisma_module_1.PrismaModule, certifications_module_1.CertificationsModule, projects_module_1.ProjectsModule, experience_module_1.ExperienceModule, languages_module_1.LanguagesModule, skills_module_1.SkillsModule],
        controllers: [job_seeker_profile_controller_1.JobSeekerProfileController],
        providers: [job_seeker_profile_service_1.JobSeekerProfileService],
    })
], JobSeekerProfileModule);
//# sourceMappingURL=job-seeker-profile.module.js.map