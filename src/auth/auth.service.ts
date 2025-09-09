import { Injectable, BadRequestException, UnauthorizedException, ForbiddenException, NotFoundException, InternalServerErrorException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from 'prisma/prisma.service';
import { ErrorCode } from 'src/common/error-code';
import { RegisterDto } from './dto/auth/register.dto';
import { MailService } from 'src/mail/mail.service';

@Injectable()
export class AuthService {
    constructor(
        private prisma: PrismaService,
        private jwt: JwtService,
        private config: ConfigService,
        private mailService: MailService
    ) { }

    async validateUser(email: string, pass: string) {
        // check email
        const user = await this.prisma.user.findUnique({ where: { email } });

        if (!user) return null;

        // check password
        const ok = await bcrypt.compare(pass, user.password);

        if (!ok) return null;

        return user;
    }

    async login(email: string, password: string) {
        // validate user
        const user = await this.validateUser(email, password);

        if (!user) throw new UnauthorizedException(ErrorCode.INVALID_CREDENTIALS);

        if (!user.isVerified) throw new ForbiddenException(ErrorCode.EMAIL_NOT_VERIFIED);

        // sign tokens
        const accessToken = await this.signAccessToken(user.id, user.role, user.email);
        const refresh = await this.createRefreshToken(user.id);



        return { accessToken, refreshToken: refresh.token, message: 'Login has been successful' };
    }

    private async signAccessToken(userId: string, role: string, email: string) {
        return this.jwt.signAsync(
            { sub: userId, role, email },
            { secret: this.config.get('JWT_ACCESS_SECRET'), expiresIn: this.config.get('JWT_ACCESS_EXPIRES_IN') },
        );
    }

    private async createRefreshToken(userId: string) {
        // create refresh token
        const expiresIn = this.config.get('JWT_REFRESH_EXPIRES_IN') || '7d';
        const expiresAt = new Date(Date.now() + this.msFromExpString(expiresIn));
        const record = await this.prisma.refreshToken.create({
            data: { userId, expiresAt },
        });

        // sign JWT with jti = record.id
        const token = await this.jwt.signAsync(
            { sub: userId, jti: record.id },
            { secret: this.config.get('JWT_REFRESH_SECRET'), expiresIn },
        );

        return { id: record.id, token, expiresAt };
    }

    async refreshToken(token: string) {
        try {
            // verify
            const payload = this.jwt.verify(token, { secret: this.config.get('JWT_REFRESH_SECRET') }) as any;
            const tokenId = payload.jti;
            const userId = payload.sub;
            if (!tokenId || !userId) throw new UnauthorizedException();

            const stored = await this.prisma.refreshToken.findUnique({ where: { id: tokenId } });
            if (!stored || stored.revoked) throw new UnauthorizedException();
            if (stored.expiresAt < new Date()) throw new UnauthorizedException();

            // update refresh
            await this.prisma.refreshToken.update({ where: { id: tokenId }, data: { revoked: true } });

            const newRefresh = await this.createRefreshToken(userId);
            const user = await this.prisma.user.findUnique({ where: { id: userId } });

            if (!user) throw new UnauthorizedException();

            const accessToken = await this.signAccessToken(userId, user.role, user.email);

            return { accessToken, refreshToken: newRefresh.token };
        } catch (err) {
            throw new UnauthorizedException(ErrorCode.INVALID_REFRESH_TOKEN);
        }
    }


    private msFromExpString(exp: string): number {
        // supports formats like "7d", "15m"
        const num = parseInt(exp.slice(0, -1), 10);
        const unit = exp.slice(-1);
        // 7d => 7 * 24 * 60 * 60 * 1000
        if (unit === 'd') return num * 24 * 60 * 60 * 1000;
        if (unit === 'h') return num * 60 * 60 * 1000;
        if (unit === 'm') return num * 60 * 1000;
        if (unit === 's') return num * 1000;

        return 7 * 24 * 60 * 60 * 1000;
    }

    async register(dto: RegisterDto) {
        try {
            const { name, email, password } = dto;

            const isEmailExist = await this.prisma.user.findUnique({ where: { email } });

            if (isEmailExist) throw new BadRequestException(ErrorCode.EMAIL_ALREADY_EXISTS);

            const hashed = await bcrypt.hash(password, 10);
            const user = await this.prisma.user.create({ data: { name, email, password: hashed } });

            const token = this.jwt.sign(
                { sub: user.id },
                {
                    secret: process.env.JWT_ACCESS_SECRET,
                    expiresIn: process.env.JWT_ACCESS_EXPIRES_IN
                }
            );

            await this.mailService.sendRegisterVerification(email, token);

            return {
                id: user.id,
                name: user.name,
                email: user.email,
                role: user.role,
                isVerified: user.isVerified,
                isBanned: user.isBanned,
                created: user.created,
                updatedAt: user.updated
            };
        } catch (error) {
            throw new InternalServerErrorException(`Error register: ${error.message}`);
        }
    }
}