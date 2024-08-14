import { redisClient } from '../redisClient.js'

let sha;

/**
 * Get the Lua source code for the script.
 * @returns {string} - Lua source code for the script.
 * @private
 */
const getSource = () => `
  local key = KEYS[1]
  local new = ARGV[1]
  local current = redis.call('GET', key)

  if (current == false) or (tonumber(new) < tonumber(current)) then
    redis.call('SET', key, new)
    return 1
  else
    return 0
  end;
`;

const load = async () => {
  // Load script on first use...
  if (!sha) {
    sha = await redisClient.script('load', getSource());
  }

  return sha;
};

const findAll = (key) => [
  sha, // Script SHA
  1, // Number of Redis keys
  key
];

export {
  /**
   * Load the script into Redis and return its SHA.
   * @returns {string} - The SHA for this script.
   */
  load,

  /**
   * Build up an array of parameters that evalsha will use to run
   * an atomic find all posts operation.
   *
   * @param {string} key - Redis key that the script will operate on.   
   * @returns {array} - an array of post objects
   */
  findAll,
};
