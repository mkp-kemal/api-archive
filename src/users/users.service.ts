import { Injectable } from '@nestjs/common';
import { PrismaService } from 'prisma/prisma.service';
import { InjectRedis } from '@nestjs-modules/ioredis';
import Redis from 'ioredis';
import { User, UsersResponse } from './models/user.model';
import { from } from 'rxjs';

@Injectable()
export class UsersService {
    constructor(
        private readonly prisma: PrismaService,
        @InjectRedis() private readonly redis: Redis,
    ) { }

    async findAll(): Promise<UsersResponse> {
        const cacheKey = 'users:all';
        const cached = await this.redis.get(cacheKey);

        if (cached) {
            return { fromCache: true, data: JSON.parse(cached) };
        }

        const users = await this.prisma.user.findMany();
        await this.redis.set(cacheKey, JSON.stringify(users), 'EX', 60);

        return { fromCache: false, data: users };
    }



    async findById(id: string): Promise<UsersResponse> {
        const cacheKey = `user:${id}`;

        const cached = await this.redis.get(cacheKey);
        if (cached){
            return {
                fromCache: true,
                data: JSON.parse(cached),
            }
        }

        const user = await this.prisma.user.findUnique({ where: { id } });

        if (user) await this.redis.set(cacheKey, JSON.stringify([user]), 'EX', 60);

        return {
            fromCache: false,
            data: user ? [user] : [],
        };
    }
}
