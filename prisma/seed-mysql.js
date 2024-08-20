import { PrismaClient } from '@prisma/client'
import { postsData } from '../data/postsData.js'

const prisma = new PrismaClient()

async function main() {
   // Erase old data... 
   await prisma.$executeRaw`truncate table posts`
   console.log('Table truncated') 

  // Seed new data 
  for (let i = 0; i < postsData.length; i++) 
    await prisma.posts.create({ data: { 
                                        userId: postsData[i].userId, 
                                        title: postsData[i].title, 
                                        body: postsData[i].body 
                                      } })
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