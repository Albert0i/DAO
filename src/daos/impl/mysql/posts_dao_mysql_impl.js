import { PrismaClient } from '@prisma/client'

// const prisma = new PrismaClient()
const prisma = new PrismaClient({
  log: [{
    emit: 'event',
    level: 'query',
  }]
})

if (process.env.NODE_ENV === "development")
  {
    prisma.$on('query', (e) => {
      console.log('Query: ' + e.query)
      console.log('Params: ' + e.params)
      console.log('Duration: ' + e.duration + 'ms')
    })
  }
// 

/**
 * Insert a new post.
 *
 * @param {Object} post - a post object.
 * @returns {Promise} - a Promise, resolving to the string value
 *   for the key of the post Redis.
 */
const insert = async (post) => {    
  return prisma.posts.create({ data: post })  
}

/**
 * Update a post.
 *
 * @param {Object} post - a post object.
 * @returns {Promise} - a Promise, resolving to the string value
 *   for the key of the post Redis.
 */
const update = async (post) => {
  // Check before update ! 
  if (await prisma.posts.findUnique({ where: { id: parseInt(post.id, 10) } })) {
    return prisma.posts.update({
      where: { id: parseInt(post.id, 10) },
      data: post
    })
  }
  else {
    return null
  }
};

/**
 * Delete a post.
 *
 * @param {Object} post - a post object.
 * @returns {Promise} - a Promise, resolving to the string value
 *   for the key of the post Redis.
 */
const del = async (id) => {
  // Check before delete ! 
  if (await prisma.posts.findUnique({ where: { id: parseInt(id, 10) } })) {
    return prisma.posts.delete({
      where: { id: parseInt(id, 10) }
    })
  }
  else {
    return null
  }
};

/**
 * Get the post object for a given post ID.
 *
 * @param {number} id - a post ID.
 * @returns {Promise} - a Promise, resolving to a post object.
 */
const findById = async (id) => {
  return prisma.posts.findUnique({ where: { id: parseInt(id, 10) } })
};

/**
 * Get an array of all post objects.
 *
 * @param {number} [limit = 9999] - number of records to return. 
 * @param {number} [offset = 0] - numver of records to skip.
 * @param {number} [id = 0] - id number to start from, using '>='. 
 * @returns {Promise} - a Promise, resolving to an array of post objects.
 * @description Add optional parameters: limit, offset and id on 2024/08/19. 
 */
const findAll = async (limit = 9999, offset = 0, id = 0) => {
  //return prisma.posts.findMany({ orderBy: { id: 'asc' } })
  return prisma.posts.findMany({ 
        where: { id: {
                  gte: parseInt(id, 10)
               } }, 
        orderBy: { id: 'asc' }, 
        skip: parseInt(offset, 10), 
        take: parseInt(limit, 10)
  })
};


/**
 * Get an array of all post objects, full-text search on title and body. 
 *
 * @param {string} keywords - key words to be search for. 
 * @returns {Promise} - a Promise, resolving to an array of post objects.
 * @description Add full-text on title and body, on 2024/08/22. 
 */
const findPosts = async (keywords) => {
  // All posts that contain the keywords in title or body
  return prisma.posts.findMany({
    where: { 
            title: {
              search: keywords    
            }, 
            body: {
              search: keywords,
            },
          }
  })
}


/**
 * Disconnect from database.
 *
 * @returns {void}
 */
const disconnect = async () => {
  prisma.$disconnect()
}

export {
  insert, update, del, findById, findAll, findPosts, disconnect
};

/*
   Prisma | CRUD 
   https://www.prisma.io/docs/orm/prisma-client/queries/crud

   15.2.13 SELECT Statement
   https://dev.mysql.com/doc/refman/8.4/en/select.html
*/