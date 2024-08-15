// import { redisClient } from './redisClient.js'
// import { findAllWithLua } from './scripts/findAll_script.js'
// import { getPostHashKey, getPostIDsKey } from './redis_key_generator.js'

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

// /**
//  * Update a post.
//  *
//  * @param {Object} post - a post object.
//  * @returns {Promise} - a Promise, resolving to the string value
//  *   for the key of the post Redis.
//  */
// const update = async (post) => {
//   const id = post.id
//   const postHashKey = getPostHashKey(id);
  
//   return await redisClient.hmset(postHashKey, post);  
//   // OK
// };

// /**
//  * Delete a post.
//  *
//  * @param {Object} post - a post object.
//  * @returns {Promise} - a Promise, resolving to the string value
//  *   for the key of the post Redis.
//  */
// const del = async (id) => {
//   const postHashKey = getPostHashKey(id);
//   const postIDsKey = getPostIDsKey()

  
//   return await redisClient.multi()
//                           .del(postHashKey)               // 1
//                           .zrem(postIDsKey, postHashKey)  // 1
//                           .exec()
//   // [ [ null, 1 ], [ null, 1 ] ]
// };

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
  await prisma.$disconnect()
}


// export {
//   insert, update, del, findById, findAll, disconnect
// };
export {
  insert, findById, findAll, disconnect
};

/*
   Prisma | CRUD 
   https://www.prisma.io/docs/orm/prisma-client/queries/crud
*/