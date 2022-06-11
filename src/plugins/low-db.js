'use strict'

const fp = require('fastify-plugin')
const { existsSync } = require('fs')
const low = require('lowdb')
const FileSync = require('lowdb/adapters/FileSync')

/**
 * This plugins adds db connector for lowDB
 *
 * @see https://www.npmjs.com/package/lowdb/v/1.0.0
 */
module.exports = fp(async function (fastify, opts) {
  const { DB_PATH: path } = opts

  if (!path) throw new Error('DB path is not specified')

  if (!existsSync(path)) throw new Error('DB file not found')

  const adapter = new FileSync(path)

  const db = low(adapter)

  fastify.decorate('db', db)
})
