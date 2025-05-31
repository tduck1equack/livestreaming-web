import { Global, Module } from "@nestjs/common";
import { TokensService } from "./tokens/tokens.service";
import { ErrorsService } from "./errors/errors.service";
import { WinstonLogger } from "./logger/winston.service";

@Global()
@Module({
  imports: [],
  providers: [TokensService, ErrorsService, WinstonLogger],
  exports: [TokensService, ErrorsService, WinstonLogger],
})
export class UtilsModule {}
