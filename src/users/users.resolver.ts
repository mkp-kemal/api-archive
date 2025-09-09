import { Resolver, Query, Mutation, Args, Int, ID } from '@nestjs/graphql';
import { RoleUser } from '@prisma/client';
import { UsersService } from './users.service';
import { UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/strategies/jwt-auth.guard';
import { RoleGuard } from 'src/auth/strategies/role-guard';
import { User, UsersResponse } from './models/user.model';

@Resolver(() => User)
export class UsersResolver {
    constructor(private readonly usersService: UsersService) { }

    @Query(() => UsersResponse)
    @UseGuards(JwtAuthGuard, RoleGuard([RoleUser.ADMIN]))
    async users() {
        return this.usersService.findAll();
    }

    @Query(() => UsersResponse)
    @UseGuards(JwtAuthGuard)
    async user(@Args('id', { type: () => ID }) id: string) {
        return this.usersService.findById(id);
    }

    //   @Query(() => User, { nullable: true })
    //   async user(@Args('id', { type: () => Int }) id: number) {
    //     return this.usersService.findOne(id);
    //   }

    //   @Mutation(() => User)
    //   async createUser(
    //     @Args('email') email: string,
    //     @Args('name') name: string,
    //   ) {
    //     return this.usersService.create({ email, name });
    //   }
}
