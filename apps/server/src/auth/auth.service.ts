import { Injectable } from "@nestjs/common";
import { PrismaService } from "@prisma/prisma.service";
import { Prisma } from "@prisma/client";
import * as argon from "argon2";

import { LoginDto } from "./dto";
import { SignupDto } from "./dto";

@Injectable()
export class AuthService {
  constructor(private prisma: PrismaService) {}
  login(loginInfo: LoginDto) {
    return {
      payload: loginInfo,
    };
  }
  async signup(signupInfo: SignupDto) {
    // Receive valid signup info
    // Check if email and username exist. If so, throw error
    // Push into prisma
    const hashedPassword = await argon.hash(signupInfo.password);
    try {
      const newUser = await this.prisma.user.create({
        data: {
          ...signupInfo,
          password: hashedPassword,
        },
      });
      return newUser;
    } catch (err) {
      return { error: err.code, message: "User already exists" };
    }
  }
}
