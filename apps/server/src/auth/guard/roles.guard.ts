import { Roles } from "@/decorators";
import { JwtPayload } from "@/types";
import { Injectable, CanActivate, ExecutionContext } from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { Request } from "express";
import { Observable } from "rxjs";

/**
 * @guard Roles guard that checks for user roles numbers (privileges).
 */
@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    // Get required roles attached to the route handler
    // If no roles exist, allow all access
    // If roles exist, log the required roles
    const requiredRoles = this.reflector.get<number[]>(
      Roles,
      context.getHandler(),
    );
    if (!requiredRoles) return true;

    const requestingUser = context.switchToHttp().getRequest().user;
    if (!requestingUser || !requestingUser.roles) return false;
    // Iterate through the user's roles
    // and check if any of them match the required roles
    for (const role of requestingUser.roles) {
      if (requiredRoles.includes(role)) return true;
    }
    return false;
  }
}
