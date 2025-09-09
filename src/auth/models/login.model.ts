import { ObjectType, Field } from '@nestjs/graphql';

@ObjectType()
export class LoginModel {
  @Field()
  accessToken: string;

  @Field()
  refreshToken: string;

  @Field()
  message: string;
}
