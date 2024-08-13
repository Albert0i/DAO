//const daoLoader = require('./daoloader');
const daoLoader = import("./daoloader.js")

const impl = daoLoader.loadDao('posts');

module.exports = {
  /**
   * Insert a new post.
   *
   * @param {Object} post - a post object.
   * @returns {Promise} - a Promise, resolving to the string value
   *   for the ID of the post in the database.
   */
  insert: async post => impl.insert(post),

  /**
   * Get the post object for a given post ID.
   *
   * @param {number} id - a post ID.
   * @returns {Promise} - a Promise, resolving to a post object.
   */
  findById: async id => impl.findById(id),

  /**
   * Get an array of all post objects.
   *
   * @returns {Promise} - a Promise, resolving to an array of post objects.
   */
  findAll: async () => impl.findAll(),
};
