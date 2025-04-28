import { Module } from "@nestjs/common";
import { AuthModule } from "./auth/auth.module";
import { ConfigModule } from "@nestjs/config";
import { PrismaModule } from "./prisma/prisma.module";
import { UserModule } from "./modules/user/user.module";

@Module({
  imports: [
    // Special Modules like config, authentication, prisma
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    PrismaModule,
    AuthModule,
    // Feature Modules
    UserModule,
  ],
})
export class AppModule {}
