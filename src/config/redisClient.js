import { Redis } from 'ioredis'

/**
 * Create a Redis instance. 
 * @returns {redisClient} The Redis Client instance 
 */
const redisClient = new Redis({
    port: 7000, // Redis port
    host: "127.0.0.1", // a Redis instance.
  });

/**
 * Close Redis connection 
 */
const disconnect = () => {
  redisClient.disconnect()
}

export { redisClient, disconnect }

/*
   Node-Redis
   https://www.npmjs.com/package/redis
*/