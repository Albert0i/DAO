### Redis 二三事 

#### Prologue 
Everybody is story teller, i mean most of us. One relates stories of the others, one relates stories of oneself. Sometimes one gets a few audiences and most of the time the audience is oneself *only*. One can have many nodding acquaintances, hardly confide to. 

The following material is extracted from [RU102JS- Redis for JavaScript developers](https://redis.io/university/courses/ru102js/) Week 4. 

#### I. [Building a Rate Limiter](https://youtu.be/let90x9uR_g)

#### II. [Programming Challenge #7](https://university.redis.com/courses/course-v1:redislabs+RU102JS+2024_03/courseware/6ec86ea00f894ac9bba46a829af4e28e/b5271ee833654fb6aab2601b92978662/)
Programming Challenge #7 Review
This final challenge was to build a sliding window rate limiter in the hitSlidingWindow method of the sliding_ratelimiter_dao_redis_impl.js module.

Here's a completed implementation to compare with your own.

// Challenge 7
const hitSlidingWindow = async (name, opts) => {
  const client = redis.getClient();

  // START Challenge #7
  const key = keyGenerator.getKey(`limiter:${opts.interval}:${name}:${opts.maxHits}`);
  const now = timeUtils.getCurrentTimestampMillis();

  const transaction = client.multi();

  const member = `${now}-${Math.random()}`;

  transaction.zadd(key, now, member);
  transaction.zremrangebyscore(key, 0, now - opts.interval);
  transaction.zcard(key);

  const response = await transaction.execAsync();

  const hits = parseInt(response[2], 10);

  let hitsRemaining;

  if (hits > opts.maxHits) {
    // Too many hits.
    hitsRemaining = -1;
  } else {
    // Return number of hits remaining.
    hitsRemaining = opts.maxHits - hits;
  }

  return hitsRemaining;

  // END Challenge #7
};
The code works as follows:

First, we get the Redis client.
The string key is then set to the key name to be used for the sliding window rate limiter. Remember to use windowSizeMS, name and maxHits in the key to ensure uniqueness.
keyGenerator.getKey() is used to add the course's key namespace prefix.
We then get the current time in milliseconds, storing it in now.
Inside a transaction, we perform the following Redis commands:
Add a new member to the sorted set at key with ZADD. We set the score to the current time in milliseconds, and the value to <current time in millisecnds>-<random number> to ensure uniqueness of values.
Remove members from the sorted set at key with ZREMRANGEBYSCORE. Members whose scores are less than the current time in milliseconds minus the length of the sliding window in milliseconds are removed. This ensures that the only members left in the sorted set are hits in the current sliding time window.
Get the cardinality of the sorted set at key with ZCARD.
If the cardinality of the sorted set is greater than the number of hits allowed in the sliding window, return -1 indicating that the rate limit has been reached. Otherwise, return the number of hits remaining in the sliding window.


#### III. [Blocking Commands](https://youtu.be/3AZTTWE0FGQ)


#### IV. [Error Handling](https://youtu.be/SdFIl5oSeVI)


#### V. [Performance Considerations](https://youtu.be/lekMouwJay0)


#### VI. [Debugging](https://university.redis.com/courses/course-v1:redislabs+RU102JS+2024_03/courseware/26a1adfb13d8404cb4cecd0079bfb2a6/5a5948815f1d411bab34b6021b7c8291/?child=first)
Debugging
From time to time, your Redis application may not behave in the expected way. That's when you'll need to start debugging. How do you debug a Redis application written with node_redis?

1. Check for Expired Keys
Key expiry is an important feature of Redis. However, you can't have code that depends on keys that have already expired. So, when debugging an issue, be certain that the keys your code depends on still exist.

Check to see which keys you're calling EXPIRE on, and be sure that the TTLs are adequate.

Check your Redis memory settings. If the maxmemory-policy setting is set to anything other than noeviction, then Redis will start evicting keys once it hits max memory.

2. Try it in the CLI
The Redis CLI is perfect for testing your data access patterns. If your code isn't working as expected, try running the equivalent Redis operations using the CLI. If it doesn't work in the CLI, it's not going to work in your application, either.

3. Monitor the Commands Sent to Redis
If it works in the CLI but not in your application, then it's possible that the application, somehow, isn't sending the right commands or arguments to the Redis server. For that, Redis provides a command that emits a stream of all operations being sent to the server. The command is called MONITOR. You'll see how to use it in the upcoming hands-on activity.

4. Special Case: Lua
Lua scripts can be tricky to debug. Redis includes a proper, fully-featured debugger for Lua that you can read about on the redis.io documentation site.


#### VII. [Client Protocol](https://university.redis.com/courses/course-v1:redislabs+RU102JS+2024_03/courseware/26a1adfb13d8404cb4cecd0079bfb2a6/5a5948815f1d411bab34b6021b7c8291/?child=first)
The Redis Protocol
The Redis protocol was designed with simplicity in mind. For this reason, it's text-based and human-readable. You can read all about the protocol on the redis.io documentation page.

Here's a small example. If you run the command:

lpush test hello
It will be encoded as follows (Note that the protocol is delimited by newlines, which consist of a carriage return (\r) followed by a line feed (\n):

*3\r\n
$5\r\n
lpush\r\n
$4\r\n
test\r\n
$5\r\n
Hello\r\n
Recall that the command consists of three strings: "lpush", "test" and "hello".

So the first line "*3" indicates that we're sending Redis an array of three elements. The "*" indicates the array type, and the "3" indicates length. The three strings will follow.

The first element of the command we're running is a 5-character string. So we pass in a "$" to signify the string type and follow that with a 5 to indicate the size of the string. The next line is the string itself, delimited by a newline: "lpush\r\n".

The next two strings follow the same pattern: ":$" to indicate a string, then a length, then a CRLF.

This command has an integer reply of 1. In the Redis protocol, that reply looks like this:

:1\r\n
Here, the ":" character indicates that the reply is an integer. This is followed by an integer. The line is then terminated with a CRLF.

Viewing the Redis Protocol Live
If you're on a Linux machine, you can observe the Redis protocol in action using ngrep:

ngrep -W byline -d lo0 -t '' 'port 6379'
If you can't use ngrep, Wireshark also works.


#### Epilogue 