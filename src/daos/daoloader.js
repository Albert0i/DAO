import 'dotenv/config'

/**
 * Load an implementation of a specified DAO.
 * @param {string} daoName - the name of the DAO to load
 * @returns {Object} - the DAO implemenation for the currently configured database.
 */
const loadDao = (daoName) => {
  const currentDatabase = process.env.DAO_DATASTORE
  
  return import(`./impl/${currentDatabase}/${daoName}_dao_${currentDatabase}_impl.js`)  
};

export  { loadDao };
