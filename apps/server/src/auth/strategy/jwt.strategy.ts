import { JwtPayload, JwtValidateReturn } from "@/types";
import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { PassportStrategy } from "@nestjs/passport";
import { ExtractJwt, Strategy } from "passport-jwt";

// Define the JWT payload interface

@Injectable()
// Name the strategy "jwt" to use in AuthGuards
export class JwtStrategy extends PassportStrategy(Strategy, "jwt") {
  constructor(private config: ConfigService) {
    const jwtSecret = config.get<string>("JWT_SECRET");
    if (!jwtSecret) {
      throw new Error("JWT_SECRET is not defined in the environment variables");
    }

    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: jwtSecret,
    });
  }

  async validate(payload: JwtPayload): Promise<JwtPayload> {
    // Return the user that requests and is validated
    return payload;
  }
}
