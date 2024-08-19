import { Redis } from 'ioredis'
import { load } from './scripts/findAll_script.js'

/**
 * Create a Redis instance. 
 * @returns {redisClient} The Redis Client instance 
 */
const redisClient = new Redis({
    port: 7000, // Redis port
    host: "127.0.0.1", // a Redis instance.
    showFriendlyErrorStack: true
  });

/**
 * Load script for findAll beforehand. 
 */
load();

/**
 * Close Redis connection
 * @returns {null} 
 */
const disconnect = () => {
  redisClient.disconnect()
}

export { redisClient, disconnect }

/*
   Node-Redis
   https://www.npmjs.com/package/redis
*/