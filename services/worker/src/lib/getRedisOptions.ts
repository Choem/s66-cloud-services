import {RedisOptions} from 'ioredis';

export function getRedisOptions(): RedisOptions {
  return {
    host: process.env.WORKER_REDIS_SERVICE,
    port: 6379,
  };
}