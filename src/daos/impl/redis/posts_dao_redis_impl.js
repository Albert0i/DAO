import { redisClient } from './redisClient.js'
import { getPostHashKey, getPostIDsKey } from './redis_key_generator.js'

/**
 * Takes a key/value pairs object representing a Redis hash, and
 * returns a new object whose structure matches that of the post domain
 * object.  Also converts fields whose values are numbers back to
 * numbers as Redis stores all hash key values as strings.
 *
 * @param {Object} postHash - object containing hash values from Redis
 * @returns {Object} - object containing the values from Redis remapped
 *  to the shape of a post domain object.
 * @private
 */
const remap = (postHash) => {
  const remappedPostHash = { ...postHash };

  remappedPostHash.id = parseInt(postHash.id, 10);
  remappedPostHash.userId = parseInt(postHash.userId, 10);

  return remappedPostHash;
};

/**
 * Insert a new post.
 *
 * @param {Object} post - a post object.
 * @returns {Promise} - a Promise, resolving to the string value
 *   for the key of the post Redis.
 */
const insert = async (post) => {
  const id = post.id
  const postHashKey = getPostHashKey(id);
  const postIDsKey = getPostIDsKey()

  await redisClient.hmset(postHashKey, post);
  await await redisClient.zadd(postIDsKey, id, postHashKey)
};

/**
 * Update a post.
 *
 * @param {Object} post - a post object.
 * @returns {Promise} - a Promise, resolving to the string value
 *   for the key of the post Redis.
 */
const update = async (post) => {
  const id = post.id
  const postHashKey = getPostHashKey(id);
  
  await redisClient.hmset(postHashKey, post);  
};

/**
 * Delete a post.
 *
 * @param {Object} post - a post object.
 * @returns {Promise} - a Promise, resolving to the string value
 *   for the key of the post Redis.
 */
const del = async (id) => {
  const postHashKey = getPostHashKey(id);
  const postIDsKey = getPostIDsKey()
  
  await redisClient.del(postHashKey);  
  await redisClient.zrem(postIDsKey, postHashKey);  
};

/**
 * Get the post object for a given post ID.
 *
 * @param {number} id - a post ID.
 * @returns {Promise} - a Promise, resolving to a post object.
 */
const findById = async (id) => {
  const postKey = getPostHashKey(id);
  const postHash = await redisClient.hgetall(postKey);

  return (Object.keys(postHash) == 0 ? null : remap(postHash));
};

/**
 * Get an array of all post objects.
 *
 * @returns {Promise} - a Promise, resolving to an array of post objects.
 */
const findAll = async () => {  
  const postIDsKey = getPostIDsKey() 
  const ids = await redisClient.zrange(postIDsKey, 0, -1)
  let words = null; 
  let id = null
  let postHash = null; 
  let allPosts = []; 
  
  for (let i=0; i < ids.length; i++) {
    words = ids[i].split(':')
    id = words[words.length-1]

    postHash = await findById(i);
    allPosts.push(postHash)
  }

  return allPosts; 
};
/* eslint-enable */

/* eslint-disable no-unused-vars */

export {
  insert, update, del, findById, findAll
};
