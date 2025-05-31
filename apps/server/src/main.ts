import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import { ConfigService } from "@nestjs/config";
import { ConsoleLogger, Logger, ValidationPipe } from "@nestjs/common";
import * as cookieParser from "cookie-parser";
import helmet from "helmet";

/**
 * @function bootstrap()
 * @description Main entry point of the whole application.
 * Also sets up some global middlewares and modules,
 * such as CORS, helmet, cookie parser and Validation Pipes
 */
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
  app.enableCors({
    origin: "http://localhost:4000",
    credentials: true,
  });
  // Secure headers with helmet
  app.use(helmet());
  // Enable cookie parsing for request and response handling
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
