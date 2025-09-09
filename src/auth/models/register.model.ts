import { ObjectType, Field, ID } from '@nestjs/graphql';

@ObjectType()
export class RegisterModel {
  @Field(() => ID)
  id: string;

  @Field()
  email: string;

  @Field()
  name: string;

  @Field()
  role?: string;

  @Field()
  isVerified?: boolean;

  @Field()
  isBanned?: boolean;

  @Field()
  createdAt?: Date;

  @Field()
  updatedAt?: Date;
}
