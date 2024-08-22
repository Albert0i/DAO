import 'dotenv/config'

// Prefix that all keys will start with, taken from config.json
const prefix = process.env.REDIS_PREFIX

/**
 * Takes a string containing a Redis key name and returns a
 * string containing that key with the application's configurable
 * prefix added to the front.  Prefix is configured in .env.
 *
 * @param {string} key - a Redis key
 * @returns {string} - a Redis key with the application prefix prepended to
 *  the value of 'key'
 * @private
 */
const getKey = key => `${prefix}:${key}`;

/**
 * Takes a numeric post ID and returns the post information key
 * value for that ID.
 *
 * Key name: prefix:posts:[postId]
 * Redis type stored at this key: hash
 *
 * @param {number} postId - the numeric ID of a post.
 * @returns - the post information key for the provided post ID.
 */
const getPostHashKey = postId => getKey(`posts:${postId}`);

/**
 * Returns the Redis key name used for the set storing all post IDs.
 *
 * Key name: prefix:posts:ids
 * Redis type stored at this key: sorted set
 *
 * @returns - the Redis key name used for the sorted set storing all post IDs.
 */
const getPostIDsKey = () => getKey('posts:ids');

/**
 * Returns the Redis post index name.
 *
 * Key name: prefix:posts:index
  *
 * @returns - the Redis key name used for the post index .
 */
const getPostIndexName = () => getKey('posts:index')

export { getPostHashKey, getPostIDsKey, getPostIndexName };
