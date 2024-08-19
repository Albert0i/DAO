import { redisClient } from './redisClient.js'
import { findAllWithLua } from './scripts/findAll_script.js'
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
 * Takes a array of array object representing a Redis hash, and
 * returns a new object whose structure matches that of the post domain
 * object.  Also converts fields whose values are numbers back to
 * numbers as Redis stores all hash key values as strings.
 *
 * @param {array} arr - array of array containing hash values from Redis
 * @returns {array} - array of object containing the values from Redis remapped
 *  to the shape of a post domain object.
 * @private
 */
function retrofit(arr) {
  let ret = []

  for (let i=0; i < arr.length; i++ ) {
      const element = arr[i]
      let obj = {}
      for (let j=0; j < element.length; j+=2 ) {
          const key = element[j]
          const value = element[j+1]
          if (key === 'id' || key === 'userId') 
              obj[key] = parseInt(value, 10)
          else
              obj[key] = value
      }
      ret.push(obj)
  }
  return ret
}

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

  return redisClient.multi()
                    .hmset(postHashKey, post)           // 'OK' 
                    .zadd(postIDsKey, id, postHashKey)  // 1
                    .exec()
  // [ [ null, 'OK' ], [ null, 1 ] ]
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
  
  return redisClient.hmset(postHashKey, post);  
  // OK
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

  return redisClient.multi()
                    .del(postHashKey)               // 1
                    .zrem(postIDsKey, postHashKey)  // 1
                    .exec()
  // [ [ null, 1 ], [ null, 1 ] ]
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
 * @param {number} [limit = 9999999999] - number of records to return. 
 * @param {number} [offset = 0] - numver of records to skip.
 * @param {number} [id = -1] - id number to start from, using '>='. 
 * @returns {Promise} - a Promise, resolving to an array of post objects.
 * @description Add optional parameters: limit, offset and id on 2024/08/19. 
 */
const findAll = async (limit, offset, id) => {    
  const postIDsKey = getPostIDsKey() 
  let allPosts = []; 

  // Method 1 - JS code
  // let ids  
  // if (id===0) {
  //   // Start from an offset
  //   ids = await redisClient.zrange(postIDsKey, offset, offset + limit - 1)
  // }
  // else {
  //   // Start from a specific id 
  //   ids = await redisClient.zrange(postIDsKey, `${id}`, '+INF', 'BYSCORE', 'LIMIT', offset, limit) 
  // }

  // let words = null; 
  // let postid = null
  // let postHash = null; 
  
  // for (let i=0; i < ids.length; i++) {
  //   words = ids[i].split(':')
  //   postid = words[words.length-1]

  //   postHash = await findById(postid);
  //   allPosts.push(postHash)
  // }

  // Method 2 - Lua script 
  // Script is loaded in redisClient.js 
  //allPosts = retrofit(await findAllWithLua(postIDsKey)) 
  allPosts = retrofit(await findAllWithLua(postIDsKey, limit, offset, id)) 

  return allPosts; 
};

/**
 * Disconnect from database.
 *
 * @returns {void}
 */
const disconnect = async () => {
  redisClient.disconnect()
}

export {
  insert, update, del, findById, findAll, disconnect
};
