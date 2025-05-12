import { TokenResponse } from "@/types";
import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { Request, Response } from "express";
import { catchError, Observable, tap } from "rxjs";

/**
 * @interceptor Cookies interceptor that processes cookies and make
 * necessary changes to the response cookies during authentication.
 * This interceptor should be used for AuthController route handlers
 */
@Injectable()
export class TokensInterceptor implements NestInterceptor {
  constructor(private reflector: Reflector) {}
  intercept(
    context: ExecutionContext,
    next: CallHandler<any>,
  ): Observable<any> | Promise<Observable<any>> {
    // Check for request cookies to see if there are any tokens available
    const request = context.switchToHttp().getRequest<Request>();
    const cookies = request.cookies;
    if (!cookies.access_token) console.log("No access token found");
    else console.log(cookies);
    const response = context.switchToHttp().getResponse<Response>();
    return next.handle().pipe(
      tap((tokens: TokenResponse) => {
        response.cookie("access-token", tokens.accessToken);
        response.cookie("refresh-token", tokens.refreshToken);
      }),
    );
  }
}
