"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.V3Module = void 0;
const common_1 = require("@nestjs/common");
const v3_service_1 = require("./v3.service");
const v3_controller_1 = require("./v3.controller");
const prisma_module_1 = require("../../prisma/prisma.module");
let V3Module = class V3Module {
};
exports.V3Module = V3Module;
exports.V3Module = V3Module = __decorate([
    (0, common_1.Module)({
        imports: [prisma_module_1.PrismaModule],
        controllers: [v3_controller_1.V3Controller],
        providers: [v3_service_1.V3Service],
    })
], V3Module);
//# sourceMappingURL=v3.module.js.map