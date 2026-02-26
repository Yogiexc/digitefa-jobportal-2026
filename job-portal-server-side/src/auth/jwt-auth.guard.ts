import { Injectable, UnauthorizedException } from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
    constructor(private readonly allowedRoles: string[]) {
        super();
    }

    handleRequest(err, user) {
        if (this.allowedRoles) {
            if (this.allowedRoles && !this.allowedRoles.includes('public')) {
                if (err || !user) {
                    throw err || new UnauthorizedException('Please login first to access this resource');
                }
            }
            // Cek apakah pengguna memiliki salah satu peran yang diizinkan
            if (this.allowedRoles && !this.allowedRoles.includes('public')) {
                if (this.allowedRoles && !this.allowedRoles.includes(user.role)) {
                    throw new UnauthorizedException('You are not authorized to access this resource');
                } else {
                    return user;
                }
            } else {
                return user;
            }
        } else {
            return user;
        }
    }
}