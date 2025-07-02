import { ForbiddenException, Injectable } from "@nestjs/common";
import { PrismaService } from "@prisma/prisma.service";
import * as argon from "argon2";

import { LoginDto } from "./dto";
import { SignupDto } from "./dto";
import { TokenResponse } from "@/types";
import { RedisService } from "@/redis/redis.service";
import { TokensService } from "@/utils/modules/tokens/tokens.service";
import { WinstonLogger } from "@/utils/modules/logger/winston.service";

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private redis: RedisService,
    private tokensUtils: TokensService,
    private logger: WinstonLogger,
  ) { }
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
        return this.tokensUtils.signTokens(user, user.roles);
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
    return this.tokensUtils.signTokens(newUser, [newRole]);
  }
  /**
   * @method signout()
   * @description Signs out an user and initializes revoking logic
   */
  async signout() { }
}
