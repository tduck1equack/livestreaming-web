import { Injectable } from "@nestjs/common";
import { PrismaService } from "@prisma/prisma.service";
import { LoginDto } from "./dto";

@Injectable()
export class AuthService {
  constructor(private prisma: PrismaService) {}
  login(loginInfo: LoginDto) {
    return {
      payload: loginInfo,
    };
  }
  signup() {
    return { message: "moved to service" };
  }
}
