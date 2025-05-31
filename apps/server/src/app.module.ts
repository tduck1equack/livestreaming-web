import { Module } from "@nestjs/common";
import { AuthModule } from "./auth/auth.module";
import { ConfigModule } from "@nestjs/config";
import { PrismaModule } from "./prisma/prisma.module";
import { UserModule } from "./modules/user/user.module";
import { RedisModule } from "./redis/redis.module";
import { UtilsModule } from "./utils/modules/utils.module";
import { APP_INTERCEPTOR } from "@nestjs/core";
import { TokenRefreshInterceptor } from "./auth/interceptor";
import { JwtModule } from "@nestjs/jwt";

@Module({
  providers: [
    {
      provide: APP_INTERCEPTOR,
      useClass: TokenRefreshInterceptor,
    },
  ],
  imports: [
    // Special Modules like config, authentication, prisma
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    JwtModule.register({ global: true }),
    PrismaModule,
    RedisModule,
    UtilsModule,
    AuthModule,
    // Feature Modules
    UserModule,
  ],
})
export class AppModule {}
