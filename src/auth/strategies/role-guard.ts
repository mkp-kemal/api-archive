import {
  Injectable,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
} from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';

export function RoleGuard(allowedRoles: string[]) {
  @Injectable()
  class RoleGuardMixin implements CanActivate {
    canActivate(context: ExecutionContext): boolean {
      // Ambil context GraphQL
      const ctx = GqlExecutionContext.create(context);
      const { user } = ctx.getContext().req;

      if (!user) {
        throw new ForbiddenException('User not authenticated');
      }

      if (!allowedRoles.includes(user.role)) {
        throw new ForbiddenException('Insufficient role');
      }

      return true;
    }
  }

  return RoleGuardMixin;
}
