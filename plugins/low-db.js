'use strict'

const fp = require('fastify-plugin')
const { existsSync } = require('fs')
const low = require('lowdb')
const FileSync = require('lowdb/adapters/FileSync')

module.exports = fp(async function (fastify, opts) {
  const { path } = opts

  if(!path) throw new Error('DB path is not specified')

  if(!existsSync(path)) throw new Error('DB file not found')

  const adapter = new FileSync(path)
  
  const db = low(adapter)

  fastify.decorate('db', db)
})
