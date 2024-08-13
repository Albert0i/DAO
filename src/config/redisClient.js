import { Redis } from 'ioredis'

const redisClient = new Redis({
    port: 7000, // Redis port
    host: "127.0.0.1", // Redis in localhost 
  });

const disconnect = () => {
  redisClient.disconnect()
}

export { redisClient, disconnect }

/*
   Node-Redis
   https://www.npmjs.com/package/redis
*/