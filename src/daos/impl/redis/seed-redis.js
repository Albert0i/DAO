import 'dotenv/config'
import { redisClient } from './redisClient.js'
import { getPostHashKey, getPostIDsKey } from './redis_key_generator.js'
import { autoIncrement } from '../redis/posts_dao_redis_impl.js'
import { postsData } from '../../../../data/postsData.js'

async function main() {
   // Erase old data... 
   //await redisClient.flushdb()   
   //console.log('Data flushed')

   // Seed new data 
   for (let i = 0; i < postsData.length; i++) {
    const id = await autoIncrement(process.env.REDIS_PREFIX + ':posts')
    const postHashKey = getPostHashKey(id)
    const postIDsKey = getPostIDsKey()

    await redisClient.multi()
                     .hmset(postHashKey, { 
                                            id, 
                                            userId: postsData[i].userId, 
                                            title: postsData[i].title, 
                                            body: postsData[i].body 
                                         })   // 'OK' 
                     .zadd(postIDsKey, id, postHashKey)  // 1
                     .exec()
   }
   // FT.CREATE DEMO:DAO:posts:index ON HASH PREFIX 1 DEMO:DAO:posts: SCHEMA id NUMERIC SORTABLE userId NUMERIC SORTABLE title TEXT SORTABLE body TEXT SORTABLE 
   await redisClient.call('FT.CREATE', 'DEMO:DAO:posts:index', 'ON', 'HASH', 'PREFIX', '1', 'DEMO:DAO:posts:', 'SCHEMA', 'id', 'NUMERIC', 'SORTABLE', 'userId', 'NUMERIC', 'SORTABLE', 'title', 'TEXT', 'SORTABLE', 'body', 'TEXT', 'SORTABLE');
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