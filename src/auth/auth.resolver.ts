import { Resolver, Mutation, Args } from '@nestjs/graphql';
import { AuthService } from './auth.service';
import { LoginModel } from './models/login.model';
import { LoginDto } from './dto/auth/login.dto';
import { RegisterDto } from './dto/auth/register.dto';
import { RegisterModel } from './models/register.model';
import { RefreshTokenModel } from './models/refresh-token.model';

@Resolver()
export class AuthResolver {
  constructor(private readonly authService: AuthService) {}

  @Mutation(() => LoginModel)
  async login(@Args('data') data: LoginDto): Promise<LoginModel> {
    return this.authService.login(data.email, data.password);
  }

  @Mutation(() => RegisterModel)
  async register (@Args('data') data: RegisterDto): Promise<RegisterModel> {
    return this.authService.register(data);
  }

//   @Mutation(() => User)
//   async register(@Args('data') data: RegisterInput): Promise<User> {
//     return this.authService.register(data);
//   }

  @Mutation(() => RefreshTokenModel)
  async refreshToken(@Args('token') token: string): Promise<RefreshTokenModel> {
    return this.authService.refreshToken(token);
  }
}
