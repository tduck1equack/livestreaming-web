import { AuthService } from "@/auth/auth.service";
import { RedisService } from "@/redis/redis.service";
import { Injectable, NestMiddleware } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { JwtService } from "@nestjs/jwt";
import { NextFunction, Request, Response } from "express";

@Injectable()
export class RefreshTokenMiddleware implements NestMiddleware {
  constructor(
    private jwt: JwtService,
    private authService: AuthService,
    private config: ConfigService,
    private redis: RedisService,
  ) {}
  async use(request: Request, response: Response, next: NextFunction) {
    const accessToken = request
      .get("authorization")
      ?.replace("Bearer", "")
      .trim();
    const refreshToken = request.cookies?.refreshToken;
  }
}
