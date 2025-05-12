import { RedisService } from "@/redis/redis.service";
import { JwtPayload, JwtPayloadWithTokens } from "@/types";
import { Injectable, UnauthorizedException } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { PassportStrategy } from "@nestjs/passport";
import { Request } from "express";
import { ExtractJwt, Strategy } from "passport-jwt";

@Injectable()
// Name the strategy "jwt-refresh" to use in AuthGuards
export class RefreshTokenStrategy extends PassportStrategy(
  Strategy,
  "jwt-refresh",
) {
  constructor(
    private config: ConfigService,
    private redis: RedisService,
  ) {
    const jwtSecret = config.get<string>("JWT_REFRESH_SECRET");
    if (!jwtSecret) {
      throw new Error(
        "JWT_REFRESH_SECRET is not defined in the environment variables",
      );
    }

    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: jwtSecret,
      passReqToCallback: true,
    });
  }

  async validate(request: Request, payload: JwtPayload): Promise<any> {
    const refreshToken = request.cookies?.refreshToken;
    if (!refreshToken)
      throw new UnauthorizedException("Refresh token not found");
    const storedToken = await this.redis.get(`user:${payload.sub}`);
    if (storedToken !== refreshToken)
      throw new UnauthorizedException("Invalid refresh token");
    return {
      payload,
      refreshToken: refreshToken,
    };
  }
}
