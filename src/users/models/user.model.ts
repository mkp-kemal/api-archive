import { ObjectType, Field, ID } from '@nestjs/graphql';
import { RoleUser } from '@prisma/client';

@ObjectType()
export class User {
    @Field(() => ID)
    id: string;

    @Field()
    email: string;

    @Field()
    name: string;

    @Field()
    password?: string;

    @Field({ defaultValue: RoleUser.VISITOR })
    role?: string;

    @Field({ defaultValue: false })
    isVerified?: boolean;

    @Field({ defaultValue: false })
    isBanned?: boolean;

    @Field()
    createdAt?: Date;

    @Field()
    updatedAt?: Date;
}

@ObjectType()
export class UsersResponse {
    @Field()
    fromCache: boolean;

    @Field(() => [User])
    data: User[];
}