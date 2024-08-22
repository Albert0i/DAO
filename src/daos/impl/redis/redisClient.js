import 'dotenv/config'
import { Redis } from 'ioredis'
import { load as loadFindALL } from './scripts/findAll_script.js'
import { load as loadAutoIncrement } from './scripts/autoIncrement_script.js'

/**
 * Create a Redis instance. 
 * @returns {redisClient} The Redis Client instance 
 */
const redisClient = new Redis({
    port: process.env.REDIS_PORT,         // Redis port
    host: process.env.REDIS_HOST,         // Redis host
    password: process.env.REDIS_PASSWORD, // Redis password 

    showFriendlyErrorStack: true          // Optimize the error stack displayed
  });

/**
 * Load scripts beforehand. 
 */
loadFindALL();
loadAutoIncrement();

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