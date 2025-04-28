import { JwtPayload } from "@/types";
import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { PassportStrategy } from "@nestjs/passport";
import { Request } from "express";
import { ExtractJwt, Strategy } from "passport-jwt";

// Define the JWT payload interface

@Injectable()
// Name the strategy "jwt" to use in AuthGuards
export class AccessTokenStrategy extends PassportStrategy(
  Strategy,
  "jwt-access",
) {
  constructor(private config: ConfigService) {
    const jwtSecret = config.get<string>("JWT_ACCESS_SECRET");
    if (!jwtSecret) {
      throw new Error(
        "JWT_ACCESS_SECRET is not defined in the environment variables",
      );
    }

    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: jwtSecret,
    });
  }

  async validate(request: Request, payload: JwtPayload): Promise<JwtPayload> {
    // Return the user that requests and is validated
    console.log("test validate function from strategy");
    console.log(request);
    console.log(payload);
    return payload;
  }
}
