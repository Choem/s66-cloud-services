import { RedisPubSub } from 'graphql-redis-subscriptions';
import Redis, { RedisOptions } from 'ioredis';

export function getPubSub(): RedisPubSub {
  const redisOptions: RedisOptions = {
    host: process.env.API_REDIS_SERVICE,
    port: 6379,
  };

  return new RedisPubSub({
    publisher: new Redis(redisOptions),
    subscriber: new Redis(redisOptions),
  });
}
