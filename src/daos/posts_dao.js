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
 */
const findById = async id => impl.findById(id)

/**
 * Get an array of all post objects.
 *
 * @returns {Promise} - a Promise, resolving to an array of post objects.
 */
const findAll = async () => impl.findAll()

/**
 * Get an array of all post objects using Lua script. 
 *
 * @returns {Promise} - a Promise, resolving to an array of post objects.
 */
const findAllEx = async () => impl.findAllEx()

/**
 * Disconnect database connection.
 *
 * @returns {void}
 */
const disconnect = async () => impl.disconnect()

export { insert, update, del, findById, findAll, findAllEx, disconnect };
