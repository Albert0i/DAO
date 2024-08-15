import { insert, update, del, findById, findAll, disconnect } from "../src/daos/posts_dao.js"

const testSuiteName = 'post_dao_redis_impl';

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
  const data = {
      userId: 9,
      id: 88,
      title: "sapiente omnis fugit eos",
      body: "consequatur omnis est praesentium\nducimus non iste\nneque hic deserunt\nvoluptatibus veniam cum et rerum sed"
    }
  const posts = await findAll();
  const singlePost = posts.filter(post => post.id === data.id);
  
  expect(posts.length).toEqual(100);
  expect(singlePost[0]).toEqual(data)
});


test(`${testSuiteName}: insert a post`, async () => {
  const data = {
      userId: 999,
      id: 999,
      title: "《史記‧商君列傳》",
      body: "公叔既死，公孫鞅聞秦孝公下令國中求賢者，將修繆公之業，東復侵地，乃遂西入秦，因孝公寵臣景監以求見孝公。"
    }
  
  const result = await insert(data);
  expect([ [ null, 'OK' ], [ null, 1 ] ]).toEqual(expect.arrayContaining(result));
  
  const post = findById(data.id)
  expect(post).resolves.toEqual(data);
});

test(`${testSuiteName}: update a post`, async () => {
  const data = {
      userId: 999,
      id: 999,
      title: "死人頭",
      body: "鞅曰：「吾說君以帝王之道比三代，而君曰：『久遠，吾不能待。且賢君者，各及其身顯名天下，安能邑邑待數十百年以成帝王乎？』故吾以彊國之術說君，君大說之耳。然亦難以比德於殷周矣。」"
    }
  
  const result = await update(data);
  expect(result).toBe('OK')

  const post = findById(data.id)  
  expect(post).resolves.toEqual(data);
});

test(`${testSuiteName}: delete a post`, async () => {
  const id = 999
  
  const result = await del(id);
  expect([ [ null, 1 ], [ null, 1 ] ]).toEqual(expect.arrayContaining(result));

  const post = findById(id)  
  expect(post).resolves.toBe(null);
});
