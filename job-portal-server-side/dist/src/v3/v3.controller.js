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
exports.V3Controller = void 0;
const common_1 = require("@nestjs/common");
const v3_service_1 = require("./v3.service");
const swagger_1 = require("@nestjs/swagger");
let V3Controller = class V3Controller {
    constructor(v3Service) {
        this.v3Service = v3Service;
    }
    getJobs() {
        return this.v3Service.getJobs();
    }
    getUserProfile(job_seeker_id) {
        return this.v3Service.getUserProfile(job_seeker_id);
    }
};
exports.V3Controller = V3Controller;
__decorate([
    (0, common_1.Get)('jobs'),
    (0, swagger_1.ApiOperation)({ summary: 'List all jobs' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], V3Controller.prototype, "getJobs", null);
__decorate([
    (0, common_1.Get)('user-profile/:job_seeker_id'),
    (0, swagger_1.ApiOperation)({ summary: 'Get user profile' }),
    __param(0, (0, common_1.Param)('job_seeker_id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], V3Controller.prototype, "getUserProfile", null);
exports.V3Controller = V3Controller = __decorate([
    (0, swagger_1.ApiTags)('v3'),
    (0, common_1.Controller)('v3'),
    __metadata("design:paramtypes", [v3_service_1.V3Service])
], V3Controller);
//# sourceMappingURL=v3.controller.js.map