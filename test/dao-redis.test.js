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
    const post = await findById(id);
    
    expect(post).toEqual(data)
  })

test(`${testSuiteName}: findById with missing post`, async () => {
  const id = 999
  const post = await findById(id);
  
  expect(post).toBe(null);
});

test(`${testSuiteName}: findAll posts, first 20`, async () => {
  const data = {
      userId: 2,
      id: 18,
      title: "voluptate et itaque vero tempora molestiae",
      body: "eveniet quo quis\nlaborum totam consequatur non dolor\nut et est repudiandae\nest voluptatem vel debitis et magnam"
    }
  const posts = await findAll(20);
  const singlePost = posts.filter(post => post.id === data.id);
  
  expect(posts.length).toBe(20);
  expect(singlePost[0]).toEqual(data)
});

// Begin add (2024/08/19)
describe(`${testSuiteName}: findAll with optional parameters`, () => {
  // ZRANGE DEMO:DAO:posts:ids 87 90
  test(`${testSuiteName}: findAll posts, limit 3 offset 87`, async () => {
    const data = [
      {
        userId: 9,
        id: 88,
        title: "sapiente omnis fugit eos",
        body: "consequatur omnis est praesentium\nducimus non iste\nneque hic deserunt\nvoluptatibus veniam cum et rerum sed"
      },
      {
        userId: 9,
        id: 89,
        title: "sint soluta et vel magnam aut ut sed qui",
        body: "repellat aut aperiam totam temporibus autem et\narchitecto magnam ut\nconsequatur qui cupiditate rerum quia soluta dignissimos nihil iure\ntempore quas est"
      },
      {
        userId: 9,
        id: 90,
        title: "ad iusto omnis odit dolor voluptatibus",
        body: "minus omnis soluta quia\nqui sed adipisci voluptates illum ipsam voluptatem\neligendi officia ut in\neos soluta similique molestias praesentium blanditiis"
      }
    ]
    const posts = await findAll(3, 87); 
    
    expect(posts.length).toBe(3);
    expect(posts).toEqual(data)
  });

  // ZRANGE DEMO:DAO:posts:ids (87 +INF BYSCORE LIMIT 0 3
  test(`${testSuiteName}: findAll posts, id>=35 limit 3 offset 0`, async () => {
    const data = [
      {
        userId: 4,
        id: 35,
        title: "id nihil consequatur molestias animi provident",
        body: "nisi error delectus possimus ut eligendi vitae\nplaceat eos harum cupiditate facilis reprehenderit voluptatem beatae\nmodi ducimus quo illum voluptas eligendi\net nobis quia fugit"
      },
      {
        userId: 4,
        id: 36,
        title: "fuga nam accusamus voluptas reiciendis itaque",
        body: "ad mollitia et omnis minus architecto odit\nvoluptas doloremque maxime aut non ipsa qui alias veniam\nblanditiis culpa aut quia nihil cumque facere et occaecati\nqui aspernatur quia eaque ut aperiam inventore"
      },
      {
        userId: 4,
        id: 37,
        title: "provident vel ut sit ratione est",
        body: "debitis et eaque non officia sed nesciunt pariatur vel\nvoluptatem iste vero et ea\nnumquam aut expedita ipsum nulla in\nvoluptates omnis consequatur aut enim officiis in quam qui"
        }
    ]
    const posts = await findAll(3, 0, 35); 
    
    expect(posts.length).toBe(3);
    expect(posts).toEqual(data)
  });
})
// End add (2024/08/19)


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
