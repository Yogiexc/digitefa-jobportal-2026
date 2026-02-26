"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppModule = void 0;
const common_1 = require("@nestjs/common");
const app_controller_1 = require("./app.controller");
const app_service_1 = require("./app.service");
const prisma_module_1 = require("../prisma/prisma.module");
const job_seekers_module_1 = require("./job_seekers/job_seekers.module");
const auth_module_1 = require("./auth/auth.module");
const login_module_1 = require("./auth/login/login.module");
const companies_module_1 = require("./companies/companies.module");
const config_1 = require("@nestjs/config");
const company_profile_module_1 = require("./profile/company-profile/company-profile.module");
const job_seeker_profile_module_1 = require("./profile/job-seeker-profile/job-seeker-profile.module");
const university_profile_module_1 = require("./profile/university-profile/university-profile.module");
const universities_module_1 = require("./universities/universities.module");
const position_levels_module_1 = require("./master-data/position-levels/position-levels.module");
const admins_module_1 = require("./admins/admins.module");
const jobs_module_1 = require("./jobs/jobs.module");
const applicants_module_1 = require("./applicants/applicants.module");
const profile_module_1 = require("./profile/profile.module");
const skills_category_module_1 = require("./master-data/skills-category/skills-category.module");
const serve_static_1 = require("@nestjs/serve-static");
const path_1 = require("path");
const log_activity_module_1 = require("./log-activity/log-activity.module");
const student_module_1 = require("./student/student.module");
const jobs_search_module_1 = require("./jobs-search/jobs-search.module");
const content_module_1 = require("./content/content.module");
const dashboard_module_1 = require("./dashboard/dashboard.module");
const experience_levels_module_1 = require("./master-data/experience-levels/experience-levels.module");
const settings_module_1 = require("./settings/settings.module");
const v3_module_1 = require("./v3/v3.module");
const lms_module_1 = require("./lms/lms.module");
let AppModule = class AppModule {
};
exports.AppModule = AppModule;
exports.AppModule = AppModule = __decorate([
    (0, common_1.Module)({
        imports: [
            serve_static_1.ServeStaticModule.forRoot({
                rootPath: (0, path_1.join)(__dirname, '..', '..', 'public'),
                serveRoot: '/public',
                serveStaticOptions: { index: false },
            }), config_1.ConfigModule.forRoot({
                envFilePath: process.env.NODE_ENV ? `.env.${process.env.NODE_ENV}` : '.env',
                isGlobal: true,
            }), prisma_module_1.PrismaModule, auth_module_1.AuthModule, login_module_1.LoginModule, admins_module_1.AdminsModule, job_seekers_module_1.JobSeekersModule, companies_module_1.CompaniesModule, universities_module_1.UniversitiesModule, profile_module_1.ProfileModule, company_profile_module_1.CompanyProfileModule, job_seeker_profile_module_1.JobSeekerProfileModule, university_profile_module_1.UniversityProfileModule, position_levels_module_1.PositionLevelsModule, jobs_module_1.JobsModule, applicants_module_1.ApplicantsModule, skills_category_module_1.SkillsCategoryModule, log_activity_module_1.LogActivityModule, student_module_1.StudentModule, jobs_search_module_1.JobsSearchModule, content_module_1.ContentModule, dashboard_module_1.DashboardModule, experience_levels_module_1.ExperienceLevelsModule, settings_module_1.SettingsModule, v3_module_1.V3Module, lms_module_1.LmsModule
        ],
        controllers: [app_controller_1.AppController],
        providers: [app_service_1.AppService],
    })
], AppModule);
//# sourceMappingURL=app.module.js.map