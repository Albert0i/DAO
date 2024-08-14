import { redisClient } from './daos/impl/redis/redisClient.js'

const script = `
    --
    -- Get an table of all post hash.
    -- @param {string} KEYS[1] - The key to operate on. 
    -- @returns {table} The table of all post hash.
    -- 
    local key = KEYS[1]
    local ids = redis.call('ZRANGE', key,  0, -1)
    local hash = {}
    local posts = {}
    
    for i = 1, #ids do
        hash = redis.call('HGETALL', ids[i])
        table.insert(posts, hash)
    end
    return posts
`
//console.log(await redisClient.ping())
//console.log(await redisClient.command('SCRIPT', 'LOAD', script))
// This will define a command myecho:

redisClient.defineCommand("myfunc", {
    numberOfKeys: 1,
    lua: script,
  });

// Now `myecho` can be used just like any other ordinary command,
// and ioredis will try to use `EVALSHA` internally when possible for better performance.
const ret = await redisClient.myfunc('DEMO:DAO:posts:ids')
console.log(ret)  

  // `myechoBuffer` is also defined automatically to return buffers instead of strings:
// const ret2 = await  redisClient.myechoBuffer("k1", "k2", "a1", "a2", (err, result) => {
//     // result[0] equals to Buffer.from('k1');
//   });
//   console.log(ret2)  