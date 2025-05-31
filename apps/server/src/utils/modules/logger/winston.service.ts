import {
  ConsoleLogger,
  Injectable,
  LoggerService,
  Scope,
} from "@nestjs/common";
import * as winston from "winston";

/**
 * @service CustomLogger
 * @description A custom logger service that extends NestJS's ConsoleLogger.
 * WIP to add external logging capabilities
 */
@Injectable({ scope: Scope.TRANSIENT })
export class WinstonLogger implements LoggerService {
  constructor() {}
  private logger = winston.createLogger({
    level: "info",
    format: winston.format.json(),
    transports: [],
  });
  private readonly context = `[WinstonLogger] [${new Date().toUTCString()}]`;
  log(message: string) {
    // this.logger.log(message);
  }

  error(message: string, trace?: string) {
    this.logger.error(message, trace);
  }

  warn(message: string) {
    this.logger.warn(message);
  }

  debug(message: string) {
    this.logger.debug(message);
  }

  verbose(message: string) {
    this.logger.verbose(message);
  }
}
