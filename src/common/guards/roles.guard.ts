import { Injectable, CanActivate, ExecutionContext, ForbiddenException} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Role } from '../types';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) { }

  canActivate(context: ExecutionContext): boolean {
    // Retrieve the required roles from the metadata using the Reflector.
    // It checks both the handler and the class for the 'roles' metadata.
    const requiredRoles = this.reflector.getAllAndOverride<Role[]>('roles', [
      context.getHandler(),
      context.getClass(),
    ])
    // If no required roles are defined, allow access.
    if (!requiredRoles) {
      return true
    }
    // Extract the request object from the execution context.
    const request = context.switchToHttp().getRequest<Request>()
    const user = request['UserInfo']

    if (!user || !user.roles) {
      return false
    }

    const hasRequiredRole = requiredRoles.some((role) => role === user.roles)

    if (!hasRequiredRole) {
      throw new ForbiddenException('You do not have permission to perform this action.')
    }
    // If the user has the required role, allow access.
    return true
  }
}