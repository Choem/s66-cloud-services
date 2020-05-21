import {RedisPubSub} from 'graphql-redis-subscriptions';
import Redis from 'ioredis';
import {getRedisOptions} from './getRedisOptions';

export function getPubSub(): RedisPubSub {
  const redisOptions = getRedisOptions();

  return new RedisPubSub({
    publisher: new Redis(redisOptions),
    subscriber: new Redis(redisOptions),
  });
}
