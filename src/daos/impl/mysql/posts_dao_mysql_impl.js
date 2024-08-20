import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

/**
 * Insert a new post.
 *
 * @param {Object} post - a post object.
 * @returns {Promise} - a Promise, resolving to the string value
 *   for the key of the post Redis.
 */
const insert = async (post) => {  
  // Check before insert ! 
  if (await prisma.posts.findUnique({ where: { id: parseInt(post.id, 10) } })) {
    return null
  }
  else {
    return prisma.posts.create({ data: post })  
  }
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
 * @param {number} limit - number of records to return. 
 * @param {number} offset - numver of records to skip.
 * @param {number} id - id number to start from, using '>='. 
 * @returns {Promise} - a Promise, resolving to an array of post objects.
 * @description Add optional parameters: limit, offset and id on 2024/08/19. 
 */
const findAll = async (limit, offset, id) => {
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
 * Disconnect from database.
 *
 * @returns {void}
 */
const disconnect = async () => {
  prisma.$disconnect()
}

export {
  insert, update, del, findById, findAll, disconnect
};

/*
   Prisma | CRUD 
   https://www.prisma.io/docs/orm/prisma-client/queries/crud

   15.2.13 SELECT Statement
   https://dev.mysql.com/doc/refman/8.4/en/select.html
*/