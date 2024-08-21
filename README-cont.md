### DAO [兜](https://humanum.arts.cuhk.edu.hk/Lexis/lexi-can/) cont. 


#### Prologue 
Reality is imperfect; perfection is unrealistic. 
No project is flawless, 


#### I. DAO Server
To leverage `post_dao`, we are going to wrap it into a DAO server using [express](https://www.npmjs.com/package/express). 

app.js
```
import 'dotenv/config'
import express from 'express'

/* import routers */
import { router as postRouter } from './routers/posts-router.js'

const port = process.env.PORT || 3000;
/* create an express app and use JSON */
const app = new express()
app.use(express.json())

/* bring in some routers */
app.use('/api/v1/posts', postRouter)

// Start the server
app.listen(port, () => {
  console.log(`Running on http://localhost:${port}`);
  console.log(`Datastore is ${process.env.DAO_DATASTORE}`)
});
```


#### II. Refining `findALL` 


#### III. [AUTO_INCREMENT](https://dev.mysql.com/doc/refman/8.4/en/example-auto-increment.html)


#### IV. implementing `findPost`


#### V. [Swagger](https://www.npmjs.com/package/swagger-ui-express)


#### Epilogue 
nodemon     json-server     PM2
mongoose    prisma          ioredis
jest        jsdos           swagger 


### EOF (2024/08/23)

