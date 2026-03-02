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
exports.JwtAuthGuard = void 0;
const common_1 = require("@nestjs/common");
const passport_1 = require("@nestjs/passport");
let JwtAuthGuard = class JwtAuthGuard extends (0, passport_1.AuthGuard)('jwt') {
    constructor(allowedRoles) {
        super();
        this.allowedRoles = allowedRoles;
    }
    handleRequest(err, user) {
        if (this.allowedRoles) {
            if (this.allowedRoles && !this.allowedRoles.includes('public')) {
                if (err || !user) {
                    throw err || new common_1.UnauthorizedException('Please login first to access this resource');
                }
            }
            if (this.allowedRoles && !this.allowedRoles.includes('public')) {
                if (this.allowedRoles && !this.allowedRoles.includes(user.role)) {
                    throw new common_1.UnauthorizedException('You are not authorized to access this resource');
                }
                else {
                    return user;
                }
            }
            else {
                return user;
            }
        }
        else {
            return user;
        }
    }
};
exports.JwtAuthGuard = JwtAuthGuard;
exports.JwtAuthGuard = JwtAuthGuard = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [Array])
], JwtAuthGuard);
//# sourceMappingURL=jwt-auth.guard.js.map