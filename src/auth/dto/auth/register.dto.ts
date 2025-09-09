import { Field, InputType } from '@nestjs/graphql';
import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString } from 'class-validator';

@InputType()
export class RegisterDto {
  @ApiProperty({ example: 'John Doe', description: 'Name' })
  @Field()
  @IsString()
  name: string;

  @ApiProperty({ example: 'user@example.com', description: 'Email' })
  @Field()
  @IsEmail()
  email: string;

  @ApiProperty({ example: 'password123', description: 'Password min 8 characters' })
  @Field()
  @IsString()
  password: string;
}
