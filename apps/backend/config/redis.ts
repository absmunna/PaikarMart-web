import Redis from 'ioredis';

const redisUrl = process.env.REDIS_URL;

let redisClient: Redis | null = null;

export const redis = new Proxy({} as Redis, {
  get: (target, prop) => {
    if (!redisClient) {
      if (!redisUrl) {
        console.warn('REDIS_URL not set, Redis operations will fail.');
        return undefined;
      }
      redisClient = new Redis(redisUrl, {
        maxRetriesPerRequest: null,
        enableReadyCheck: false,
      });
      redisClient.on('error', (err) => console.log('Redis Client Error', err));
      redisClient.on('connect', () => console.log('Redis Client Connected'));
    }
    return (redisClient as any)[prop];
  }
});
