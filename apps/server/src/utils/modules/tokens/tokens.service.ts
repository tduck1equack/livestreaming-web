import { PrismaService } from "@/prisma/prisma.service";
import { RedisService } from "@/redis/redis.service";
import { JwtPayload, TokenResponse } from "@/types";
import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { JwtService } from "@nestjs/jwt";
import { User, UserRole } from "@prisma/client";

/**
 * @service TokensService
 * @description Service for tokens-related tasks like generating, signing and refreshing JWT tokens.
 * This should be imported in the UtilsModule
 */
@Injectable()
export class TokensService {
  constructor(
    private jwt: JwtService,
    private config: ConfigService,
    private redis: RedisService,
  ) {}
  /**
   * @method generateToken
   * @description Generate a pair of JWT tokens (access and refresh) for the user
   * The tokens are then processed via other methods in AuthService of AuthModule
   * @param user Full user information
   * @returns Generated tokens for consumption in other methods, such as signToken() or updateRefreshToken()
   */
  async generateTokens(user: User, roles: UserRole[]): Promise<TokenResponse> {
    const accessTokenPayload: JwtPayload = {
      sub: user.id,
      email: user.email,
      username: user.username,
      roles: roles.map((role) => role.roleId),
      iat: Date.now() / 1000,
      exp: (Date.now() + 60 * 60 * 1000) / 1000, // 1 hour expiration for access token
    };
    const refreshTokenPayload: JwtPayload = {
      sub: user.id,
      email: user.email,
      username: user.username,
      roles: roles.map((role) => role.roleId),
      iat: Date.now() / 1000,
      exp: (Date.now() + 7 * 24 * 60 * 60 * 1000) / 1000, // 1 hour expiration for access token
    };

    // Import Secret from config module
    // And sign with JWT service
    const accessToken: string = await this.jwt.signAsync(accessTokenPayload, {
      expiresIn: "1h",
      secret: this.config.get("JWT_ACCESS_SECRET"),
    });
    const refreshToken: string = await this.jwt.signAsync(refreshTokenPayload, {
      expiresIn: "7d",
      secret: this.config.get("JWT_REFRESH_SECRET"),
    });
    const tokens: TokenResponse = {
      accessToken,
      refreshToken,
    };
    return tokens;
  }
  /**
   * Signs the generated tokens and stores the refresh token in Redis
   * The refresh token is stored in Redis with a TTL of 7 days
   * @param user
   * @returns generated tokens from generateToken()
   */
  async signTokens(user: User, roles: UserRole[]): Promise<TokenResponse> {
    const tokens = await this.generateTokens(user, roles);
    await this.redis.set(
      `user:${user.id}`,
      tokens.refreshToken,
      60 * 60 * 24 * 7,
    );
    return {
      accessToken: tokens.accessToken,
      refreshToken: tokens.refreshToken,
    };
  }
  /**
   *
   * @param user Full user payload with roles
   * @returns
   */
  // TODO: Update refresh token
  async refreshTokens(user: User, roles: UserRole[]): Promise<TokenResponse> {
    const tokens = await this.generateTokens(user, roles);
    await this.redis.set(
      `user:${user.id}`,
      tokens.refreshToken,
      60 * 60 * 24 * 7,
    );
    return tokens;
  }
  /**
   *
   * @param userId User ID so that Redis can find and delete the stored token
   */
  async revokeTokens(userId: string) {
    await this.redis.del(`user:${userId}`);
  }
}
