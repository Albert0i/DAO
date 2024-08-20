import 'dotenv/config'

import express from 'express'
const port = process.env.PORT || 3000;

/* import routers */
import { router as postRouter } from './routers/posts-router.js'

/* create an express app and use JSON */
const app = new express()
app.use(express.json())

/* bring in some routers */
app.use('/api/v1/posts', postRouter)

// Start the server
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
