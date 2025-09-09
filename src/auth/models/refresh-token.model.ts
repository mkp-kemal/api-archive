import { ObjectType, Field } from '@nestjs/graphql';

@ObjectType()
export class RefreshTokenModel {
  @Field()
  accessToken: string;

  @Field()
  refreshToken: string;
}
