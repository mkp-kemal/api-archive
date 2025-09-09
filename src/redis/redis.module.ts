// redis/redis.module.ts
import { Module } from '@nestjs/common';
import { RedisModule as NestRedisModule } from '@nestjs-modules/ioredis';

@Module({
    imports: [
        NestRedisModule.forRoot({
            type: 'single',             // single instance Redis
            url: `redis://${process.env.REDIS_HOST}:${process.env.REDIS_PORT}`, // url Redis
        }),
    ],
    exports: [NestRedisModule],     // biar bisa diinject di module lain
})
export class RedisModule { }
