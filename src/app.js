import 'dotenv/config'
import express from 'express'
import swaggerUi from 'swagger-ui-express';
import YAML from 'yamljs'
import { banner } from './banner.js'
import { disconnect } from './daos/posts_dao.js'

const port = process.env.PORT || 3000;

/* import routers */
import { router as postRouter } from './routers/posts-router.js'

/* create an express app and use JSON */
const app = new express()
app.use(express.json())

/* bring in some routers */
app.use('/api/v1/posts', postRouter)

// set up Swagger UI in the root 
const swaggerDocument = YAML.load('./src/swagger.yaml')
app.use('/api/v1/docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument))

// Start the server
app.listen(port, () => {
  banner()
  console.log(`Running on http://localhost:${port}`);
  console.log(`Datastore is ${process.env.DAO_DATASTORE}`)
});

// Trap Ctrl+C to gracefully shutdown the server
process.on('SIGINT', () => {
  disconnect()
  console.log(`Ctrl+C pressed. Closing ${process.env.DAO_DATASTORE} connection...`);
});