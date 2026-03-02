import { Injectable, UnauthorizedException } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { PassportStrategy } from "@nestjs/passport";
import { ExtractJwt, Strategy } from "passport-jwt";
import { PrismaService } from "prisma/prisma.service";

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
    constructor(
        private prisma: PrismaService, private configService: ConfigService) {
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            ignoreExpiration: false,
            secretOrKey: configService.get<string>('JWT_SECRET_KEY'),
        });
    }

    async validate(payload: any) {
        let user;
        if (payload.role === 'job_seeker') {
            user = await this.prisma.job_seekers.findUnique({ where: { job_seeker_id: payload.job_seeker_id } });
        } else if (payload.role === 'university') {
            user = await this.prisma.universities.findUnique({ where: { university_id: payload.university_id } });
        } else if (payload.role === 'company') {
            user = await this.prisma.companies.findUnique({ where: { company_id: payload.company_id } });
        } else if (payload.role === 'superadmin') {
            user = await this.prisma.admins.findUnique({ where: { admin_id: payload.admin_id } });
        }
        if (!user) {
            throw new UnauthorizedException("Token is invalid. Please log in again.");
        }
        // const tokenIssuedAt = new Date(payload.iat * 1000).getTime();
        // const passwordChangedAt = new Date(user.password_changed_at).getTime();
        // if (tokenIssuedAt < passwordChangedAt) {
        //     throw new UnauthorizedException("Token is invalid. Please log in again.");
        // }
        return payload

    }
}