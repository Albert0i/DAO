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
  return prisma.posts.update({
    where: { id: post.id },
    data: post
  })
};

/**
 * Delete a post.
 *
 * @param {Object} post - a post object.
 * @returns {Promise} - a Promise, resolving to the string value
 *   for the key of the post Redis.
 */
const del = async (id) => {
  return prisma.posts.delete({
    where: { id  }
  })
};

/**
 * Get the post object for a given post ID.
 *
 * @param {number} id - a post ID.
 * @returns {Promise} - a Promise, resolving to a post object.
 */
const findById = async (id) => {
  return prisma.posts.findUnique({ where: { id } })
};

/**
 * Get an array of all post objects.
 *
 * @returns {Promise} - a Promise, resolving to an array of post objects.
 */
const findAll = async () => {    
  return prisma.posts.findMany({ })
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
*/