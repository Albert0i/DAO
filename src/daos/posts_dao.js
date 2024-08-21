import { loadDao } from "./daoloader.js"

const impl = await loadDao('posts');

/**
 * Insert a new post.
 *
 * @param {Object} post - a post object.
 * @returns {Promise} - a Promise, resolving to the string value
 *   for the ID of the post in the database.
 */
const insert = async post => impl.insert(post)

/**
 * Update a post.
 *
 * @param {Object} post - a post object.
 * @returns {Promise} - a Promise, resolving to the string value
 *   for the ID of the post in the database.
 */
const update = async post => impl.update(post)

/**
 * Delete a post.
 *
 * @param {Object} post - a post object.
 * @returns {Promise} - a Promise, resolving to the string value
 *   for the ID of the post in the database.
 */
const del = async post => impl.del(post)

/**
 * Get the post object for a given post ID.
 *
 * @param {number} id - a post ID.
 * @returns {Promise} - a Promise, resolving to a post object.
 * 
 */
const findById = async id => impl.findById(id)

/**
 * Get an array of all post objects.
 *
 * @param {number} [limit = 9999] - number of records to return. 
 * @param {number} [offset = 0] - numver of records to skip.
 * @param {number} [id = 0] - id number to start from, using '>='. 
 * @returns {Promise} - a Promise, resolving to an array of post objects.
 * @description Add optional parameters: limit, offset and id on 2024/08/19. 
 */
const findAll = async (limit = 9999, offset = 0, id = 0) => impl.findAll(limit, offset, id)

/**
 * Disconnect database connection.
 *
 * @returns {void}
 */
const disconnect = async () => impl.disconnect()

export { insert, update, del, findById, findAll, disconnect };
