import 'dotenv/config'
import { Router } from 'express'
import { insert, update, del, findById, findAll, disconnect } from '../daos/posts_dao.js'

export const router = Router()

router.options('/', async(req, res) => {
  res.status(200).send({ 'DAO_DATASTORE': process.env.DAO_DATASTORE})
})

router.get('/', async (req, res) => {
  const { limit, offset, id } = req.query
  const posts = await findAll(limit, offset, id)
  
  res.status(200).send(posts)
})

router.get('/:id', async (req, res) => {  
  const post = await findById(req.params.id)

  res.status(post ? 200 : 204).send(post ? post : {} )
})

router.post('/', async (req, res) => {
  const result = await insert(req.body)
  
  res.status(result ? 201 : 400).send(result)
})

router.put('/:id', async(req, res) => {
  const result = await update({...req.body, id: req.params.id})

  res.status(result ? 200 : 400).send(result)
})

router.delete('/:id', async (req, res) => {
  const result = await del(req.params.id)
  
  res.status(result ? 204 : 400).send(result)
})
