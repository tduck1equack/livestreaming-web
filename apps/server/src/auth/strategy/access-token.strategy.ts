import { JwtPayload } from "@/types";
import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { PassportStrategy } from "@nestjs/passport";
import { Request } from "express";
import { ExtractJwt, Strategy } from "passport-jwt";

/**
 * @strategy Access token strategy for consumption in JwtGuard
 * This strategy will validate and attach the payload
 * (in this case, the user information) to the request object
 */
@Injectable()
// Name the strategy "jwt" to use in AuthGuards
export class AccessTokenStrategy extends PassportStrategy(
  Strategy,
  "jwt-access",
) {
  constructor(private config: ConfigService) {
    const jwtAccessSecret = config.get<string>("JWT_ACCESS_SECRET");
    if (!jwtAccessSecret) {
      throw new Error(
        "JWT_ACCESS_SECRET is not defined in the environment variables",
      );
    }

    super({
      jwtFromRequest: ExtractJwt.fromHeader("access-token"),
      secretOrKey: jwtAccessSecret,
      passReqToCallback: true,
    });
  }
  async validate(request: Request, payload: JwtPayload): Promise<JwtPayload> {
    return payload;
  }
}
