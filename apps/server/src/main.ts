import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import { ConfigService } from "@nestjs/config";
import { ConsoleLogger, Logger, ValidationPipe } from "@nestjs/common";
import * as cookieParser from "cookie-parser";

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    logger: new ConsoleLogger({
      timestamp: true,
      colors: true,
      // Potential JSON logging for better external logger integration
    }),
  });
  const logger = new Logger("Bootstrap");

  // Enable CORS so the web can access the API
  app.enableCors();
  app.use(cookieParser());
  // Use NestJS's built-in Pipes in place of Zod
  app.useGlobalPipes(
    new ValidationPipe({
      // Prevent unnecessary request params
      whitelist: true,
    }),
  );
  const configService = app.get(ConfigService);

  const apiPrefix = configService.get<string>("API_ENDPOINT") || "api/v1";
  // Fallback to default port 3000 if environment is not set
  const serverPort = configService.get<number>("SERVER_PORT") ?? 3000;
  app.setGlobalPrefix(apiPrefix);

  logger.log(
    `API up and running at port ${serverPort} and endpoint root ${apiPrefix}`,
  );
  app.listen(serverPort);
}
bootstrap();
