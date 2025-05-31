import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { PrismaClient } from "@prisma/client";

/**
 * @service Wrapper service class that extends PrismaClient
 * to align with NestJS modules convention
 * while maintaining Prisma's base functions
 */
@Injectable()
export class PrismaService extends PrismaClient {
  constructor(private config: ConfigService) {
    super({
      datasources: {
        db: {
          url: config.get<string>("DATABASE_URL"),
        },
      },
    });
  }
  // TODO: Better Prisma queries function implementations?
}
