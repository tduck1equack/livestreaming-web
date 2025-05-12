import { ForbiddenException, Injectable } from "@nestjs/common";
import { PrismaService } from "@prisma/prisma.service";
import * as argon from "argon2";

import { LoginDto } from "./dto";
import { SignupDto } from "./dto";
import { JwtService } from "@nestjs/jwt";
import { ConfigService } from "@nestjs/config";
import { JwtPayload, TokenResponse } from "@/types";
import { User, UserRole } from "@prisma/client";
import { RedisService } from "@/redis/redis.service";

@Injectable()
export class AuthService {
  constructor(
    private config: ConfigService,
    private prisma: PrismaService,
    private redis: RedisService,
    private jwt: JwtService,
  ) {}
  /**
   * Log in and authenticate a user
   * This method checks if user exists in the database with correct email and password
   * If so, it generates a pair of JWT tokens (access and refresh) for the user
   * @param loginInfo information including email and password of user
   * @returns User's signed tokens
   * @throw Forbidden Exception on invalid password
   * @error
   */
  // TODO: Handle exception when there are internal errors
  async login(
    loginInfo: LoginDto,
  ): Promise<TokenResponse | { error: string; message: string }> {
    const user = await this.prisma.user.findUnique({
      where: { email: loginInfo.email },
      include: {
        roles: true,
      },
    });
    if (!user) throw new ForbiddenException("User doesn't exist");
    try {
      if (await argon.verify(user.password, loginInfo.password)) {
        return this.signToken(user, user.roles);
      } else throw new ForbiddenException("Invalid password");
    } catch (err) {
      return {
        error: err.code,
        message: "Server error. Please try again in a few minutes",
      };
    }
  }
  /**
   * Sign up a new user using email, password and phone number
   * Assume a default role "user" to the new registered user
   * @param signupInfo
   * @returns User's signed tokens, ready for consumption
   */
  async signup(signupInfo: SignupDto) {
    // Receive valid signup info
    // Check if email and username exist. If so, throw error
    // Push into prisma
    const hashedPassword = await argon.hash(signupInfo.password);
    if (
      await this.prisma.user.findUnique({ where: { email: signupInfo.email } })
    )
      throw new ForbiddenException("Email already exists");
    if (
      await this.prisma.user.findUnique({
        where: { phoneNumber: signupInfo.phoneNumber },
      })
    )
      throw new ForbiddenException("Phone number already exists");
    const newUser = await this.prisma.user.create({
      data: {
        ...signupInfo,
        password: hashedPassword,
      },
    });
    const newRole = await this.prisma.userRole.create({
      data: {
        userId: newUser.id,
        roleId: 4, // Default role for new users
      },
    });
    return this.signToken(newUser, [newRole]);
  }
  async signOut() {}

  /**
   * Generate a pair of JWT tokens (access and refresh) for the user
   * The tokens are then processed via other methods in AuthService of AuthModule
   * @param user Full user payload
   * @returns Generated tokens for consumption in other methods, such as signToken() or updateRefreshToken()
   */
  async generateToken(user: User, roles: UserRole[]): Promise<TokenResponse> {
    const payload: JwtPayload = {
      sub: user.id,
      email: user.email,
      username: user.username,
      roles: roles.map((role) => role.roleId),
      iat: Date.now() / 1000,
    };
    // Import Secret from config module
    // And sign with JWT service
    const accessToken: string = await this.jwt.signAsync(payload, {
      expiresIn: "1h",
      secret: this.config.get("JWT_ACCESS_SECRET"),
    });
    const refreshToken: string = await this.jwt.signAsync(payload, {
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
  async signToken(user: User, roles: UserRole[]): Promise<TokenResponse> {
    const tokens = await this.generateToken(user, roles);
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
  async updateRefreshToken(
    user: User,
    roles: UserRole[],
  ): Promise<TokenResponse> {
    const tokens = await this.generateToken(user, roles);
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
  async revokeToken(userId: string) {
    await this.redis.del(`user:${userId}`);
  }
}
