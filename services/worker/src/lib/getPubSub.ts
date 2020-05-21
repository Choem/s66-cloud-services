import { RedisPubSub } from 'graphql-redis-subscriptions';
import Redis, { RedisOptions } from 'ioredis';

export function getPubSub(): RedisPubSub {
  console.log(process.env);
  const redisOptions: RedisOptions = {
    host: process.env.REDIS_SERVICE,
    port: 6379,
  };

  return new RedisPubSub({
    publisher: new Redis(redisOptions),
    subscriber: new Redis(redisOptions),
  });
}
