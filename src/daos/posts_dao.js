//const daoLoader = require('./daoloader');
import { loadDao } from "./daoloader.js"

const impl = await loadDao('posts');

/**
 * Insert a new post.
 *
 * @param {Object} site - a site object.
 * @returns {Promise} - a Promise, resolving to the string value
 *   for the ID of the site in the database.
 */
const insert = async post => impl.insert(post)

/**
 * Get the site object for a given site ID.
 *
 * @param {number} id - a site ID.
 * @returns {Promise} - a Promise, resolving to a site object.
 */
const findById = async id => impl.findById(id)

/**
 * Get an array of all site objects.
 *
 * @returns {Promise} - a Promise, resolving to an array of site objects.
 */
const findAll = async () => impl.findAll()

export { insert, findById, findAll };
