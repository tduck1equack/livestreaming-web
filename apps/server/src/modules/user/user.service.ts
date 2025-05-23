import { PrismaService } from "@/prisma/prisma.service";
import { Injectable } from "@nestjs/common";

@Injectable()
export class UserService {
  constructor(private prisma: PrismaService) {}

  async getUserList() {
    return await this.prisma.user.findMany();
  }
}
