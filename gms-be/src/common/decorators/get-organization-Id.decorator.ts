import { createParamDecorator, ExecutionContext, UnauthorizedException } from '@nestjs/common';

export const GetOrganizationId = createParamDecorator(
  (_data: unknown, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    
    if (!request.user) {
      throw new UnauthorizedException('User not authenticated');
    }

    const organizationId = request.user.organizationId;
    
    if (!organizationId) {
      throw new UnauthorizedException('User does not belong to an organization');
    }

    return organizationId;
  },
);
