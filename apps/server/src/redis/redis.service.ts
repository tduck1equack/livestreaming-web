import {
  Injectable,
  Logger,
  OnModuleDestroy,
  OnModuleInit,
} from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { error } from "console";
import { createClient, RedisClientType } from "redis";

@Injectable()
export class RedisService implements OnModuleInit, OnModuleDestroy {
  public client: RedisClientType;
  private readonly logger = new Logger(RedisService.name);

  constructor(private config: ConfigService) {}
  async onModuleInit() {
    try {
      this.client = createClient({
        url: this.config.get("REDIS_URL"),
        socket: {
          reconnectStrategy: (attempts: number) => {
            if (attempts >= 3) {
              this.logger.error("Failed to connect to Redis in 3 attempts");
              process.exit(0);
            }
            return attempts * 500;
          },
        },
      });
      this.client.on("error", (err) => {
        this.logger.error("Internal Redis error");
      });
      await this.client.connect();
      this.logger.log("Redis client connected successfully");
    } catch (error) {
      this.logger.error("Unexpected error while connecting to Redis: ", error);
      process.exit(0);
    }
  }
  async onModuleDestroy() {
    if (this.client?.isOpen) {
      await this.client.disconnect();
      this.logger.log("Redis disconnected");
    }
  }
  async set(key: string, value: string, ttl?: number) {
    try {
      await this.client.set(key, value);
      if (ttl) await this.client.expire(key, ttl);
    } catch (error) {
      this.logger.error(
        `Redis failed to set value "${value}" at key "${key}": `,
        error,
      );
      throw new Error("Redis operation failed");
    }
  }

  async get(key: string): Promise<string | null> {
    try {
      return await this.client.get(key);
    } catch (error) {
      this.logger.error(
        `Redis failed to get value at key "${key}": `,
        error.message,
      );
      throw new Error("Redis operation failed");
    }
  }

  async del(key: string) {
    try {
      return await this.client.del(key);
    } catch (error) {
      this.logger.error(
        `Redis failed to delete value at key ${key}: `,
        error.message,
      );
      throw new Error("Redis operation failed");
    }
  }
}
