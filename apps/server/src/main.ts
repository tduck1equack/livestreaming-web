import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import { ConfigService } from "@nestjs/config";
import { ValidationPipe } from "@nestjs/common";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Use NestJS's built-in Pipes
  app.useGlobalPipes(
    new ValidationPipe({
      // Prevent unnecessary request params
      whitelist: true,
    }),
  );
  const configService = app.get(ConfigService);

  const apiPrefix = configService.get<string>("API_ENDPOINT") || "api/v1";

  app.setGlobalPrefix(apiPrefix);

  console.log(`Using API endpoint: localhost:4000/${apiPrefix}`);

  // TODO: Un-hardcode server port
  app.listen(3000);
}
bootstrap();
