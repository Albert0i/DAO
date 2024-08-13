import { PrismaClient } from '@prisma/client'
import { postsData } from '../data/postsData.js'

const prisma = new PrismaClient()

async function main() {
   let response, i, j 
   // Erase old data... 
   response = await prisma.$executeRaw`truncate table posts`
   console.log('Table truncated') 

  // Seed new data 
  for (i = 1; i <= 1000 * 1000; i++) {
    j = Math.floor(Math.random() * 100)
    response = await prisma.posts.create({
        data: {
          id: i, 
          userId: postsData[j].userId,
          title: postsData[j].title,
          body: postsData[j].body 
        }
      })
    if (Math.floor(i/10000) === (i/10000) ) console.log(`${i}`)
  }
  console.log('Done') 
  }

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })

/*
   Seeding
   https://www.prisma.io/docs/orm/prisma-migrate/workflows/seeding#integrated-seeding-with-prisma-migrate   

   Raw queries
   https://www.prisma.io/docs/orm/prisma-client/queries/raw-database-access/raw-queries
*/