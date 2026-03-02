"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.StaticFilesMiddleware = void 0;
const common_1 = require("@nestjs/common");
const fs_1 = require("fs");
const path_1 = require("path");
let StaticFilesMiddleware = class StaticFilesMiddleware {
    use(req, res, next) {
        const filePath = (0, path_1.join)(__dirname, '..', '..', '..', 'public', req.path);
        if ((0, fs_1.existsSync)(filePath)) {
            next();
        }
        else {
            next(new common_1.NotFoundException('Resource not found'));
        }
    }
};
exports.StaticFilesMiddleware = StaticFilesMiddleware;
exports.StaticFilesMiddleware = StaticFilesMiddleware = __decorate([
    (0, common_1.Injectable)()
], StaticFilesMiddleware);
//# sourceMappingURL=static-files.middleware.js.map