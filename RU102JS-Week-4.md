### Redis 二三事 

> Not often in a life-time does a man stand on the edge of eternity, but when I spoke those words in that East End cellar I was perfectly certain that they were my last words on earth. I braced myself for the shock of those black, rushing waters beneath, and experienced in advance the horror of that breath-choking fall.


#### Prologue 
Everybody is story-teller, i mean most of us. One relates stories of others, one relates stories of oneself. Chances are one gets a couple of audiences and more often than not the *only* audience is oneself. Just like one can have many nodding acquaintances but to aught one could confide... 

I am just an ordinary dull old man who cherish for anything valuable. The following material is taken from [RU102JS- Redis for JavaScript developers](https://redis.io/university/courses/ru102js/) Week 4. 


#### I. [Building a Rate Limiter](https://youtu.be/let90x9uR_g)
In this unit, we're going to use Redis and Node.js to build a simple rate limiter. **A rate limiter keeps track of the number of requests a user is making and prevents careless users and malicious actors from making too many requests.** This is especially important when an API exposes *expensive* operations. If you're hosting an API that does image processing, for example, you want to make sure that users don't overwhelm your servers. A rate limiter can prevent this. 

![alt rate limiter](img/rate-limiter.png)

There are many ways to build a rate limiter. Two common techniques are the fixed window and the sliding window.

![alt rate limiter techniques](img/rate-limiter-techniques.png)

A fixed window rate limiter counts all requests within a specific time interval. So as its name implies, you can stipulate that a user not make more than five requests in any one-minute fixed interval. Here each tick mark represents a request. So within the 12:01 interval, the user can make up to 5 requests. Within the 12:02 interval, the user can make another five requests. In both cases, the user will be rate limited on the sixth request within the fixed one-minute bucket. 

![alt fixed window](img/fixed-window.png)

In a sliding window rate limiter, you can stipulate that a user not make more than five requests in any given 60-second interval, regardless of minute boundaries. So perhaps the user makes three requests at 12:00 and 30 seconds and three more requests at 12:01 and 15 seconds. In that case, the user will be rate limited, even though their six requests crossed the minute boundary.

![alt sliding window](img/sliding-window.png)

A fixed window rate limiter is a bit easier to implement but less precise. A sliding window rate limiter is more precise but trickier to implement, uses a bit more space, and is slightly less time-efficient. 

![alt rate limiter comparison](img/rate-limiter-comparison.png)

In this unit, we'll see how to implement the fixed window rate limiter. And in the upcoming challenge, you'll build your own sliding window rate limiter. In `rate_limiter_dao.js`, we've defined the rate-limiting interface. 

![alt hit interface](img/hit-interface.png)

It consists of a single function called `hit`, which takes two arguments: `name`, a string that uniquely identifies the thing being rate limited. You'll likely pass in a user ID or an API token here, indicating which user is hitting the service, and `opts`, an object containing two keys, which are `interval`, a minute interval, and `maxHits`, the number of hits allowed within the minute interval. The `hit` function returns a promise that resolves to the number of hits remaining or 0 if the user has exceeded the rate limit for the time interval. Now open up `rate_limiter_dao_redis_impl.js`. 

![alt hit impl](img/hit-impl.png)

You can see here that our `hit` function is actually implemented in a function named `hitFixedWindow`. Turning to the implementation of the `hitFixedWindow` function, you'll see that we first get the name of the key storing the number of hits. This key naming is important, so let's take a moment to review it. 

![alt fixed window key naming](img/fixed-window-key-naming.png)

The schema for a key looks like this. We have the text limiter followed by the name of the rate limiter, which will usually contain the user ID or access token I just mentioned. And that's followed by the minute block, which is the minute of the day or the block of minutes in the day that constitutes the fixed window. Finally, this is followed by the max number of hits for that interval. 

So here we create a pipeline. Then we atomically increment the value at the rate-limiting key by 1 using the `INCR` command. We set a time to live on the key with the `EXPIRE` command since we won't need the key once its interval is complete. We call exec on the pipeline to send the commands to Redis. Then we check to see if the number of hits is greater than the maximum allowed. If it is, we've reached the rate limit for this time period and return -1. If not, we return the number of hits remaining before the rate-limiting takes effect.

![alt hit limit](img/hit-limit.png)

So we just saw how to build a fixed window rate limiter using Node.js and Redis. There are quite a few advantages to this approach. It's space-efficient, consisting of a counter stored in a single Redis key. It runs in constant time, employing two O(1) commands, INCR and EXPIRE. And it uses a pipeline, ensuring only one roundtrip to Redis. This design will work for a lot of use cases.

![alt fixed window rate limiter](img/fixed-window-rate-limiter.png)

However, if you need more precision, you'll want a sliding window-based rate limiter. And in the next challenge, you'll get the chance to build one.

![alt sliding window rate limiter](img/sliding-window-rate-limiter.png)


#### II. [Programming Challenge #7 Review](https://university.redis.com/courses/course-v1:redislabs+RU102JS+2024_03/courseware/6ec86ea00f894ac9bba46a829af4e28e/b5271ee833654fb6aab2601b92978662/)
This final challenge was to build a sliding window rate limiter in the `hitSlidingWindow` method of the `sliding_ratelimiter_dao_redis_impl.js` module.

Here's a completed implementation to compare with your own.

```
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
```

The code works as follows:

- First, we get the Redis client.
- The string `key` is then set to the key name to be used for the sliding window rate limiter. Remember to use `windowSizeMS`, `name` and `maxHits` in the key to ensure uniqueness.
- `keyGenerator.getKey()` is used to add the course's key namespace prefix.
- We then get the current time in milliseconds, storing it in `now`.
- Inside a transaction, we perform the following Redis commands:
1. Add a new member to the sorted set at key with ZADD. We set the score to the current time in milliseconds, and the value to `<current time in millisecnds>-<random number>` to ensure uniqueness of values.
2. Remove members from the sorted set at `key` with `ZREMRANGEBYSCORE`. Members whose scores are less than the current time in milliseconds minus the length of the sliding window in milliseconds are removed. This ensures that the only members left in the sorted set are hits in the current sliding time window.
3. Get the cardinality of the sorted set at key with `ZCARD`.
4. If the cardinality of the sorted set is greater than the number of hits allowed in the sliding window, return -1 indicating that the rate limit has been reached. Otherwise, return the number of hits remaining in the sliding window.


#### III. [Blocking Commands](https://youtu.be/3AZTTWE0FGQ)
ean that the Redis server itself is blocked.
Other clients can still send commands to it.
Using the second client, I am now sending an LPUSH command
to add an element, in this case, the string,
"goodbye", to the list.
This unblocks our consuming client, which
returns the value "goodbye".
We can also see the time in seconds
that the client was blocked for.
Using blocking commands prevents applications
from needing to implement a polling strategy
and saves the server from executing commands
unnecessarily.
The server informs the blocked client
when the value it was waiting for has been set.
The client can use the timeout option
to give up after a period of time, if necessary,
so that it doesn't wait forever.
Blocking commands do add the slight overhead
of managing more than one connection to Redis,
in the case where your application
needs to send other commands while its client is blocking.
Let's see what that looks like with node_redis.
Here I'm view the file blocking_commands.js
in the examples folder.
This uses the list data type and a blocking command
to implement a simple queue.
This is the producer function.
It runs every second, pushing a number
onto the head of a Redis list.
I'm using the LPUSH command to do this,
incrementing the value of the number pushed each time.
After 20 iterations, the producer
will stop pushing numbers onto the list and quit.
At the other end of our queue is a blocking consumer function.
This function uses its own separate node_redis client.
We need this so that the producer
can keep sending commands to Redis
while the consumer blocks, waiting for values to appear
in the queue.
The consumer sits in a loop, sending the BRPOP command
to retrieve the value from the tail of our list
when one exists.
It blocks for two seconds, then times out
if no value has been added.
The consumer function maintains a counter
of the number of consecutive timeouts,
exiting after 5 retries if no new value is added to the list.
Here I'm starting the consumer, then starting the producer
five seconds later.
Let's see what happens when we run the code.
The consumer starts first.
No value is added to the list within it's 2-second timeout
period, so it reports that the queue
is empty and blocks again.
This continues until the producer starts
adding values to the list.
The consumer's blocking BRPOP command then returns a value
rather than timing out.
Once the producer has generated 20 values, it shuts down.
The consumer pops the 20th value off of the list
and blocks again, waiting for a new value to appear.
As the producer has shut down, no more values are added.
The consumer's BRPOP command times out,
and it reports that the queue is empty.
After finding an empty list five consecutive times,
the consumer also shuts down and closes its node_redis client.
If you'd like to study this code in more detail yourself,
it's available in a file named blocking_commands.js
in the examples folder.
Redis provides blocking commands for a variety
of data structures.
These include lists, of course, sorted sets, streams,
and the publish/subscribe features.
So in this unit, we saw how blocking commands
work as a more efficient alternative to polling
and how to implement a basic blocking queue with the list
data type.
Do keep in mind that within any Node.js application using
node_redis, you'll need one client
instance per blocking use case.
This is the only time you'll need
to initialize more than one client in a Node.js node_redis
application.
End of transcript. Skip to the start.


#### IV. [Error Handling](https://youtu.be/SdFIl5oSeVI)
Video transcript
Start of transcript. Skip to the end.
Let's take a few moments to look at how
node_redis handles errors.
We'll first see how to deal with errors that occur when
we send bad commands to Redis.
Then we'll move on to look at how node_redis
handles connection errors.
We're looking at the file, error_handling_async.await.js
in the examples folder.
Here, I'm calling the SET command,
but have not provided the second parameter containing
the new value to store at key.
In this case, we can expect the promised return from setAsync
to be rejected, and caught by the catch handler, which
will log the resulting error object.
Running the code shows that the promise is indeed rejected,
and that node_redis returns a ReplyError object.
Here we can see that the ReplyError object has a name
property, as well as a message property whose
value is the error message.
Additionally, we can access the command, code and args
properties separately.
You can use these values in your error handling code
to make decisions about what to do next,
as well as to create informative log
messages for your application.
Errors resulting from sending invalid commands to the Redis
server will all follow this same basic pattern.
For example, here I am attempting
to use the INCR command to increment
the value of a key that contains a string.
This is an invalid operation.
So the promise returned by incrAsync will be rejected.
We can expect to see that the catch block receives and logs
an instance of ReplyError.
And here's what that looks like.
As before, we receive an appropriate error message,
plus the breakdown of the command and the arguments
that were sent to Redis.
So far, we've seen what to expect
if an error occurs when sending a single command to Redis.
Throughout the course, we've encouraged
you to consider pipelining and transactions whenever
multiple commands can be batched up together and sent to Redis
in a single round trip.
But what if one or more of those commands
is invalid or otherwise fails?
Let's take a look at that using a pipeline as an example.
Here, I'm building up a pipeline containing three commands.
I start by setting the value of a key to the string test.
Next, I attempt to increment the value stored at that key.
This will result in an error, as we cannot increment string
values.
Finally, I'll get the value stored in the key.
I've wrapped the whole pipeline in a try/catch block.
So when I call execAsync here to run the pipeline,
we should expect to see the resulting promise to reject,
with the error object logged by the catch handler.
Let's run the code and see if that's
what actually happens here.
Here, I'm running the code to send the pipeline to Redis.
And here's the result, which may not be what you were expecting.
No exception was thrown, so our catch block was never executed.
Instead, the promise returned by execAsync resolves
successfully and returned an array of responses as normal.
The first element in the array is OK,
indicating that the initial SET command was successful.
The second element is a ReplyError object.
This tells us that the INCR command failed and why.
It's important to note that this error did not
cause the execution of further commands
in the pipeline to stop.
The third element in the array is the string test,
which is the response for our GET command.
You can also expect to see the same error reporting behavior
when using a transaction.
So when working with pipelines and transactions,
you'll want to check the response array for errors
and consider actions that your application might need
to take if a command fails.
Even if every command we send to Redis is correct,
we'll still have to deal with another type of error.
We need to handle the case where the Redis server is down
or our application can't reach it over the network.
Let's see how node_redis handles connection errors,
and how we can implement a connection retry strategy.
The node_redis client emits events
when the status of the connection to Redis changes.
Here, I'm adding a listener for the connect event, which
fires as soon as a connection to the Redis server
is established.
And here, I'm adding a listener for the reconnecting event.
node_redis passes an object to this listener containing
details about the number of retry attempts made so far,
and the time since the last connection attempt.
We'll see how this works shortly.
Previously when creating a node_redis client,
we saw that we can pass a configuration object
to the createClient function.
So far, we've used this to specify
the host and port of the Redis server to connect to.
This object can contain additional keys
whose values are used to configure the client's
behavior.
One of these is retry_strategy, which
can be set to a function containing logic
for performing connection retries when Redis is
down or otherwise unreachable.
This function is invoked when the connection to Redis is lost
or cannot be established.
It is passed an object containing details
about the client's current retry attempt,
and can use this information to decide
how the client should proceed.
Let's walk through a simple retry strategy implementation.
Here, I'm checking if we have attempted to reconnect
more than five times.
If so, return an error, which stops
node_redis from making further retry attempts.
If we haven't retried five times yet,
the function returns a number.
This is the number of milliseconds
that node_redis should wait before making
the next retry attempt.
Here, I'm using a basic decaying retry
that waits one second, then two, and so on.
The options object contains other keys
whose values may be useful in building a retry strategy.
For a full description of these, see the node_redis
documentation.
So bringing all of this together,
we first create a Redis client, specifying our host, port,
and retry_strategy.
Then add event listeners for the connect
and reconnecting events.
Now let's see what happens when we run the code.
First, I'm shutting down the Redis server on my Macintosh
development machine.
Now, I'm starting our example code.
As the Redis Server is down, node_redis can't connect to it,
and begins to run our retry strategy.
On each retry, the reconnecting listener is invoked.
And we can see that it receives an object containing
information about the current retry attempt.
After five tries, the server is still down.
So node_redis gives up and the program terminates.
But what happens if we try and send commands
to Redis while node_redis is attempting
to reconnect to the server.
Here, I've amended our example code
to add a simple SET command and log the response in the Redis
Server.
If this command succeeds, we'd expect the string response, OK.
Let's try running our code again with the Redis server offline.
This time, though, I'll start Redis
after a couple of connection retry attempts.
OK, so Redis has stopped.
Let's start our example code.
We don't yet see an OK response from our SET command.
But we can see attempts to reconnect to Redis.
I'm now starting the Redis server,
and the code's connected successfully.
And our SET command has now also completed successfully.
So what happened with our SET command here?
It wasn't immediately sent to Redis
because the connection wasn't available.
node_redis buffered it for later execution,
then sent it to Redis once the connection was established.
In this unit, we discovered how to handle
errors that can arise from sending
invalid commands to Redis.
In a carefully written and well-tested, application
these should be a rare occurrence.
But it's always good to know how to deal with them.
We also saw how node_redis can manage the connection
to the Redis server should the server become unavailable
or the connection lost.
Being able to identify and report such occurrences
is something that you should consider in your application
design.
End of transcript. Skip to the start.


#### V. [Performance Considerations](https://youtu.be/lekMouwJay0)
Video transcript
Start of transcript. Skip to the end.
To say that performance is important is an understatement.
After all, Redis was built for developers requiring
sub-millisecond data access.
Of course, performance is also a wide ranging topic,
and in this unit we're going to stick
to performance considerations for the application developer.
These considerations can be divided
into three main categories.
The first concerns network latency, the second
concerns the time complexity of Redis commands,
and the last relates to atomicity and blocking.
We've already discussed latency at length,
but let's review the main points.
First, you should use pipelining whenever
you need to run more than one Redis command
and don't need an immediate response to those commands.
Pipelining cuts down on the number of round trips
your client makes to the Redis server.
It also results in less context switching on the server
side and fewer syscalls.
This is especially important when
you're potentially making tens of calls to the Redis server.
For example, in this findAll function,
we first fetch a set of keys, and then for each key,
we call HGETALL.
This is the scenario you need to watch out for.
In general, when running commands in a loop,
you should strongly consider wrapping the loop in a pipeline
like so.
Let's now talk about the time complexity of Redis commands.
In general, it's important to be aware of the time complexity
of the commands you're running.
You can find the time complexity of every Redis command
on the Redis.io website.
Constant time commands are the most efficient and, happily,
quite a few Redis commands fall into the O(1) complexity
bucket.
These include GET, SET, HGET, HSET, LPUSH, LPOP, SADD,
SREM, and many others.
You generally don't have to worry about the performance
of these commands.
Logarithmic time commands are also very efficient
and generally should not cause concern.
You'll see these commands described as O(log(n)).
We can see why these commands are
efficient with a little math.
Log base 2 of 10,000 is only about 13,
and log base 2 of a million is only about 20.
Many of the sorted set commands, such as ZADD and ZRANK,
are O(log(n)).
So running ZADD on a sorted set with a million elements
has a time complexity of O(20).
It's the linear time commands, the commands marked O(n),
that you should be careful with.
But even here, it all depends on the value of n.
For example, let's look at the LRANGE example.
You may recall this code from earlier in the course.
Here, we're calling LRANGE to return
all the elements of a list.
If the list contains 50 elements,
then this command has time complexity of O(50),
and Redis can execute such a command
in a matter of microseconds.
But if the list contains a million elements,
then we're at O(1,000,000), which is
a completely different story.
Running O(n) commands where n is large
is a problem for two reasons.
First, these commands can take a relatively long time
to complete.
This is because they use a lot of CPU
and they tend to return a lot of data,
which takes time to buffer.
Second, because Redis is mostly single threaded,
no other commands will be executed
while these long-running commands are running.
All other client commands will be queued up
until the current command is done running.
So to take an example, on my development laptop running
an LRANGE to retrieve all the elements in a four million
element list takes the Redis server about 300 milliseconds
or close to a third of a second.
So if we have 1,000 clients all issuing commands
against the Redis server and one client issues
a command that takes 300 milliseconds for the server
to process, then those 1,000 client commands
will all queue up behind that long-running command,
and they'll all have to wait for at least 300 milliseconds
before each of them is served.
There are a few O(n) commands that you should almost never
run in production.
The most notorious of these is the KEYS command,
which returns all of the keys on the server matching a given
pattern.
As an example, running KEYS * on a key space of four million
keys on my development laptop occupies the server for four
seconds.
And it's common for Redis servers
to host hundreds of millions of keys.
So we recommend never running the KEYS command
on a production server.
And if you build extremely large lists or hashes with thousands
of elements, then you should probably also avoid
LRANGE and HGETALL as well.
It's a good practice to disable such commands altogether.
See the links on this page for documentation
on disabling commands.
OK, so to round out this chapter,
let's review atomicity and blocking,
specifically as they relate to transactions and Lua scripts.
In Redis, transactions and Lua scripts
both run atomically and block, which
means that while they're running,
no other commands can run.
So you'll always need to keep this in mind
when using these features.
When running a transaction or Lua script,
consider the time complexity of the commands
you plan to run, and understand the cost of
running thousands of commands within a transaction or Lua
script.
If you don't need transactional semantics,
use a pipeline, which doesn't block for the duration of its run.
Redis is a high-performance data store
that keeps all of its data in memory.
But you still have a responsibility
to understand the cost of network round-trips,
time complexity of the commands you're running,
and the cardinality of your data structures.
You'll get the most out of Redis by paying attention
to these considerations as you design your data access
strategies.
End of transcript. Skip to the start.


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