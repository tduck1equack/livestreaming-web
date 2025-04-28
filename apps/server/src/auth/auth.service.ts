import { ForbiddenException, Injectable } from "@nestjs/common";
import { PrismaService } from "@prisma/prisma.service";
import * as argon from "argon2";

import { LoginDto } from "./dto";
import { SignupDto } from "./dto";
import { JwtService } from "@nestjs/jwt";
import { ConfigService } from "@nestjs/config";
import { JwtPayload } from "@/types";
import { User } from "@prisma/client";

@Injectable()
export class AuthService {
  constructor(
    private config: ConfigService,
    private prisma: PrismaService,
    private jwt: JwtService,
  ) {}
  async login(loginInfo: LoginDto) {
    // Find user by email
    // If user not found, throw error "User doesn't exist"
    // Verify password hash
    // If incorrect, throw error "Invalid password"
    const user = await this.prisma.user.findUnique({
      where: { email: loginInfo.email },
    });
    if (!user) throw new ForbiddenException("User doesn't exist");
    try {
      if (await argon.verify(user.password, loginInfo.password)) {
        return this.signToken(user);
      } else throw new ForbiddenException("Invalid password");
    } catch (err) {
      return {
        error: err.code,
        message: "Server error. Please try again in a few minutes",
      };
    }
  }
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
    await this.prisma.userRole.create({
      data: {
        userId: newUser.id,
        // roleId 2 is currently user, we want any newly registered user to be assigned
        // to the "user" role
        roleId: 2,
      },
    });
    return this.signToken(newUser);
  }

  // TODO: Add types for schema
  async signToken(user: User): Promise<{ access_token: string }> {
    const iat: number = Date.now() / 1000;
    const payload: JwtPayload = {
      sub: user.id,
      email: user.email,
      username: user.username,
      iat,
    };
    // Import Secret from .env instead of setting it in the module
    const token: string = await this.jwt.signAsync(payload, {
      expiresIn: "1h",
      secret: this.config.get("JWT_SECRET"),
    });
    return { access_token: token };
  }
}
