import  { redisClient } from "../../../config/redisClient.js"

/**
 * Insert a new post.
 *
 * @param {Object} post - a post object.
 * @returns {Promise} - a Promise, resolving to the string value
 *   for the key of the post Redis.
 */
const insert = async (post) => {
  // const client = redis.getClient();

  // const siteHashKey = keyGenerator.getSiteHashKey(site.id);

  // await client.hmsetAsync(siteHashKey, flatten(site));
  // await client.saddAsync(keyGenerator.getSiteIDsKey(), siteHashKey);

  // return siteHashKey;
};

/**
 * Get the site object for a given site ID.
 *
 * @param {number} id - a site ID.
 * @returns {Promise} - a Promise, resolving to a site object.
 */
const findById = async (id) => {
  // const client = redis.getClient();
  // const siteKey = keyGenerator.getSiteHashKey(id);

  // const siteHash = await client.hgetallAsync(siteKey);

  // return (siteHash === null ? siteHash : remap(siteHash));
  return redisClient.hgetall(`posts:${id}`)
  //return redisClient.ping()
};

/**
 * Get an array of all post objects.
 *
 * @returns {Promise} - a Promise, resolving to an array of post objects.
 */
const findAll = async () => {
  // START CHALLENGE #1 (2024/04/05)
  // const client = redis.getClient();
  // const ids = await client.smembersAsync(keyGenerator.getSiteIDsKey());

  // let words = null; 
  // let id = null
  // let siteHash = null; 
  // let allSites = []; 

  // for (i=0; i< ids.length; i++) {
  //   words = ids[i].split(':');
  //   id = words[words.length-1];
  //   //console.log(`id = ${id}`) 

  //   siteHash = await findById(id);
  //   //console.log('siteHash') 
  //   //console.log(siteHash)

  //   allSites.push(siteHash)
  //   //console.log(`loop allSites.length = ${allSites.length}`);
  //}
  
  //console.log(`final allSites.length = ${allSites.length}`);
  //return allSites;
  return [];    
  // End fix 
  // END CHALLENGE #1 (2024/04/05)
};
/* eslint-enable */

/* eslint-disable no-unused-vars */

export {
  insert, findById, findAll
};
