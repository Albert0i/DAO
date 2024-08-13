import { redisClient } from './redisClient.js'
import { postsData } from '../../data/postsData.js'

async function main() {
   // Erase old data... 
   await redisClient.flushdb()
   console.log('Data flushed')

   // Seed new data 
   for (let i = 0; i < postsData.length; i++) 
      await redisClient.hmset(`posts:${i+1}`, postsData[i])
    
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