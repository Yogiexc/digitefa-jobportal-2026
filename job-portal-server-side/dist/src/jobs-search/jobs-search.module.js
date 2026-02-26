"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.JobsSearchModule = void 0;
const common_1 = require("@nestjs/common");
const jobs_search_service_1 = require("./jobs-search.service");
const jobs_search_controller_1 = require("./jobs-search.controller");
const prisma_module_1 = require("../../prisma/prisma.module");
const axios_1 = require("@nestjs/axios");
let JobsSearchModule = class JobsSearchModule {
};
exports.JobsSearchModule = JobsSearchModule;
exports.JobsSearchModule = JobsSearchModule = __decorate([
    (0, common_1.Module)({
        imports: [prisma_module_1.PrismaModule, axios_1.HttpModule.register({
                timeout: 5000,
                maxRedirects: 5,
            })],
        controllers: [jobs_search_controller_1.JobsSearchController],
        providers: [jobs_search_service_1.JobsSearchService],
    })
], JobsSearchModule);
//# sourceMappingURL=jobs-search.module.js.map