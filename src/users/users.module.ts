import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { PrismaModule } from 'prisma/prisma.module';
import { UsersResolver } from './users.resolver';
import { RedisModule } from 'src/redis/redis.module';

@Module({
  imports: [PrismaModule, RedisModule],
  providers: [UsersService, UsersResolver],
  controllers: [],
  exports: [UsersService],
})
export class UsersModule {}
