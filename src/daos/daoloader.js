import 'dotenv/config'

/* eslint-disable import/no-dynamic-require, global-require */

/**
 * Load an implementation of a specified DAO.
 * @param {string} daoName - the name of the DAO to load
 * @returns {Object} - the DAO implemenation for the currently configured database.
 */
const loadDao = (daoName) => {
  const currentDatabase = process.env.DAO_DATASTORE
  
  return import(`./impl/${currentDatabase}/${daoName}_dao_${currentDatabase}_impl`)  
};
/* eslint-enable */

export  { loadDao };
