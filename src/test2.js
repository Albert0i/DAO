
import { load, findAllEx } from './daos/impl/redis/scripts/findAll_script.js'

load()

const result = await findAllEx()

console.log(result)