import { redisClient, disconnect } from '../src/config/redisClient.js'
import { findById } from "../src/daos/posts_dao.js"

afterAll( async () => await redisClient.ping() );
afterAll( async () => await disconnect() );

test("Get post 66 via DAO", async () => {
    const data = {
        id: '66',
        userId: '7',
        title: 'repudiandae ea animi iusto',
        body: 'officia veritatis tenetur vero qui itaque\n' +
          'sint non ratione\n' +
          'sed et ut asperiores iusto eos molestiae nostrum\n' +
          'veritatis quibusdam et nemo iusto saepe',
      }
    expect(findById(66)).resolves.toEqual(data)
  })
