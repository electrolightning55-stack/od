import { CanActivate, ExecutionContext, Injectable, ForbiddenException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ROLES_KEY } from '../decorators/role.decorator';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.getAllAndOverride<string[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    if (!requiredRoles?.length) return true;

    const { user } = context.switchToHttp().getRequest();

    if (!user?.userId || !user?.roleName) {
      throw new ForbiddenException('Missing userId or roleName in token');
    }

    // Allow organizationAdmin to access if they match organization context
    if (user.roleName === 'organizationAdmin') {
      const organizationId = context.switchToHttp().getRequest().organizationId;
      if (!organizationId) {
        console.error('[RolesGuard] Missing organizationId in request for organizationAdmin');
        throw new ForbiddenException('Organization context missing');
      }
      console.log('[RolesGuard] Allowing organizationAdmin access for organization:', organizationId);
      return true;
    }

    // For other roles, check exact match
    if (!requiredRoles.includes(user.roleName)) {
      console.error('[RolesGuard] Access denied. User role:', user.roleName, 'Required roles:', requiredRoles);
      throw new ForbiddenException(
        `Access denied. Required roles: ${requiredRoles.join(', ')}`,
      );
    }

    return true;
  }
}
