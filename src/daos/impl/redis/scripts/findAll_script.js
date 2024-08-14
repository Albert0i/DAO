import { redisClient } from '../redisClient.js'

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
const load = async () => {
  redisClient.defineCommand("myfunc", {
    numberOfKeys: 1,
    lua: script,
  });  
};

const findAllWithLua = () => {
  return redisClient.myfunc('DEMO:DAO:posts:ids')
}
  
export { load, findAllWithLua };

/*
ioredis | Lua Scripting
https://github.com/redis/ioredis

ioredis supports all of the scripting commands such as EVAL, EVALSHA and SCRIPT. 
However, it's tedious to use in real world scenarios since developers have to take 
care of script caching and to detect when to use EVAL and when to use EVALSHA. 
ioredis exposes a defineCommand method to make scripting much easier to use:

const redis = new Redis();

// This will define a command myecho:
redis.defineCommand("myecho", {
  numberOfKeys: 2,
  lua: "return {KEYS[1],KEYS[2],ARGV[1],ARGV[2]}",
});

// Now `myecho` can be used just like any other ordinary command,
// and ioredis will try to use `EVALSHA` internally when possible for better performance.
redis.myecho("k1", "k2", "a1", "a2", (err, result) => {
  // result === ['k1', 'k2', 'a1', 'a2']
});

// `myechoBuffer` is also defined automatically to return buffers instead of strings:
redis.myechoBuffer("k1", "k2", "a1", "a2", (err, result) => {
  // result[0] equals to Buffer.from('k1');
});

// And of course it works with pipeline:
redis.pipeline().set("foo", "bar").myecho("k1", "k2", "a1", "a2").exec();

*/