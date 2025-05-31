import { PrismaService } from "@/prisma/prisma.service";
import { RedisService } from "@/redis/redis.service";
import { JwtPayload, TokenResponse } from "@/types";
import { clearTokenCookies, setTokenCookies } from "@/utils";
import { TokensService } from "@/utils/modules/tokens/tokens.service";
import {
  CallHandler,
  ExecutionContext,
  Injectable,
  Logger,
  NestInterceptor,
} from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { Reflector } from "@nestjs/core";
import { JwtService } from "@nestjs/jwt";
import { Request, Response } from "express";
import { Observable, tap } from "rxjs";

/**
 * @interceptor Cookies interceptor that processes cookies and make
 * necessary changes to the response cookies during authentication.
 * This interceptor should be used for AuthController route handlers
 */
@Injectable()
export class AttachTokensInterceptor implements NestInterceptor {
  constructor(private reflector: Reflector) {}
  intercept(
    context: ExecutionContext,
    next: CallHandler<any>,
  ): Observable<any> | Promise<Observable<any>> {
    const response = context.switchToHttp().getResponse<Response>();
    return next.handle().pipe(
      tap((tokens: TokenResponse) => {
        // Set maxAge to corresponding to the expiry duration
        // from the JwtService
        response.cookie("access_token", tokens.accessToken, {
          httpOnly: true,
          secure: true,
          sameSite: "strict",
          maxAge: 60 * 60 * 1000, // 1 hour duration
        });
        response.cookie("refresh_token", tokens.refreshToken, {
          httpOnly: true,
          secure: true,
          sameSite: "strict",
          maxAge: 7 * 24 * 60 * 60 * 1000, // 1 week duration
        });
      }),
    );
  }
}
/**
 * @interceptor Token refresh interceptor that processes the response
 *
 */
@Injectable()
export class TokenRefreshInterceptor implements NestInterceptor {
  constructor(
    private reflector: Reflector,
    private jwt: JwtService,
    private config: ConfigService,
    private redis: RedisService,
    private tokensUtils: TokensService,
    private prisma: PrismaService,
  ) {}
  async intercept(
    context: ExecutionContext,
    next: CallHandler<any>,
  ): Promise<Observable<any>> {
    const request = context.switchToHttp().getRequest<Request>();
    const response = context.switchToHttp().getResponse<Response>();
    const accessToken = request.cookies["access_token"];
    const refreshToken = request.cookies["refresh_token"];

    const logger = new Logger(TokenRefreshInterceptor.name);

    if (!accessToken || !refreshToken) {
      return next.handle();
    }
    try {
      const accessTokenPayload = this.jwt.verify<JwtPayload>(accessToken, {
        secret: this.config.get<string>("JWT_ACCESS_SECRET"),
      });
      const curTime = Math.floor(Date.now() / 1000);
      const expTime = accessTokenPayload.exp;
      const timeRemaining = expTime - curTime;
      // Logic
      // Check if access token is 15 minutes away from expiry
      const expThreshold = 15 * 60; // (seconds)
      // If so, check refresh token validity
      if (timeRemaining < expThreshold) {
        const storedRefreshToken = await this.redis.get(
          `user:${accessTokenPayload.sub}`,
        );
        if (storedRefreshToken === refreshToken) {
          const user = await this.prisma.user.findUnique({
            where: { id: accessTokenPayload.sub },
            include: { roles: true },
          });
          if (!user) {
            // Ho ho, someone's getting naughty
            logger.warn(
              `Found refresh tokens, but user with ID ${accessTokenPayload.sub} not found`,
            );
            await this.tokensUtils.revokeTokens(accessTokenPayload.sub);
            clearTokenCookies(response);
          } else {
            // User found, refresh the tokens
            const refreshedTokens = await this.tokensUtils.refreshTokens(
              user,
              user.roles,
            );
            setTokenCookies(response, refreshedTokens);
            logger.log(
              `Refreshed tokens for user ID ${accessTokenPayload.sub}`,
            );
          }
        }
      }
    } catch (error) {
      logger.error(`Token validation error: ${error.message}`);
    }
    return next.handle();
  }
}
/**
 * @interceptor Revoking interceptor that automatically clears tokens
 */

@Injectable()
export class RevokeTokensInterceptor implements NestInterceptor {
  intercept(
    context: ExecutionContext,
    next: CallHandler<any>,
  ): Observable<any> | Promise<Observable<any>> {
    const response = context.switchToHttp().getResponse<Response>();
    clearTokenCookies(response);
    return next.handle();
  }
}
