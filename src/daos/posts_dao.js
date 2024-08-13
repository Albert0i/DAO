//const daoLoader = require('./daoloader');
import { loadDao } from "./daoloader.js"

const impl = await loadDao('posts');

const findById = async id => impl.findById(id)

export { findById };
