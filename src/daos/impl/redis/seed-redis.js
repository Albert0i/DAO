import { redisClient } from './redisClient.js'
import { getPostHashKey, getPostIDsKey } from './redis_key_generator.js'
import { postsData } from '../../../../data/postsData.js'

async function main() {
   // Erase old data... 
   await redisClient.flushdb()
   console.log('Data flushed')

   // Seed new data 
   for (let i = 0; i < postsData.length; i++) {
    const id = postsData[i].id
    const postHashKey = getPostHashKey(id)
    const postIDsKey = getPostIDsKey()

    await redisClient.multi()
                     .hmset(postHashKey, postsData[i])   // 'OK' 
                     .zadd(postIDsKey, id, postHashKey)  // 1
                     .exec()
   }    
   console.log('Done') 
  }

main()
  .then(async () => {
    await redisClient.quit()
  })
  .catch(async (e) => {
    console.error(e)
    await redisClient.$disconnect()
    process.exit(1)
  })

/*
   Seeding
   https://www.prisma.io/docs/orm/prisma-migrate/workflows/seeding#integrated-seeding-with-prisma-migrate   

   Raw queries
   https://www.prisma.io/docs/orm/prisma-client/queries/raw-database-access/raw-queries
*/