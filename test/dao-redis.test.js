import { redisClient, disconnect } from '../src/daos/impl/redis/redisClient.js'
import { insert, findById, findAll } from "../src/daos/posts_dao.js"

const testSuiteName = 'post_dao_redis_impl';

afterAll( async () => { 
  await redisClient.ping()
} );

afterAll( async () => { 
  // Release Redis connection.
  await disconnect()
} );

test(`${testSuiteName}: findById with existing post`, async () => {
    const data = {
        userId: 7,
        id: 66,
        title: "repudiandae ea animi iusto",
        body: "officia veritatis tenetur vero qui itaque\nsint non ratione\nsed et ut asperiores iusto eos molestiae nostrum\nveritatis quibusdam et nemo iusto saepe"
      }
    const id = 66
    const post = findById(id);
    
    expect(post).resolves.toEqual(data)
  })

test(`${testSuiteName}: findById with missing post`, async () => {
  const id = 999
  const post = findById(id);
  
  expect(post).resolves.toBe(null);
});

test(`${testSuiteName}: findAll posts`, async () => {
  const posts = await findAll();

  expect(posts.length).toEqual(100);
});

test(`${testSuiteName}: insert a post`, async () => {
  const data = {
      userId: 999,
      id: 999,
      title: "《史記‧商君列傳》",
      body: "鞅曰：「吾說君以帝王之道比三代，而君曰：『久遠，吾不能待。且賢君者，各及其身顯名天下，安能邑邑待數十百年以成帝王乎？』故吾以彊國之術說君，君大說之耳。然亦難以比德於殷周矣。」"
    }
  
  await insert(data);
  const post = findById(data.id)
  
  expect(post).resolves.toEqual(data);
});