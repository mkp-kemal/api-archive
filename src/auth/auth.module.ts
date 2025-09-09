import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { PrismaModule } from 'prisma/prisma.module';
import { AuthService } from './auth.service';
import { JwtStrategy } from './strategies/jwt.strategy';
import { RefreshTokenStrategy } from './strategies/refresh.strategy';
import { AuthResolver } from './auth.resolver';
import { MailModule } from 'src/mail/mail.module';

@Module({
  imports: [
    ConfigModule,
    PassportModule.register({ defaultStrategy: 'jwt', session: false }),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: (config: ConfigService) => ({
        secret: config.get('JWT_ACCESS_SECRET'),
        signOptions: { expiresIn: config.get('JWT_ACCESS_EXPIRES_IN') || '15m' },
      }),
      inject: [ConfigService],
    }),
    PrismaModule,
    MailModule
  ],
  providers: [
    AuthService,
    JwtStrategy,
    RefreshTokenStrategy,
    AuthResolver,
  ],
  controllers: [],
  exports: [AuthService],
})
export class AuthModule {}
