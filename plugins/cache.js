'use strict'

const fp = require('fastify-plugin')
const NodeCache = require('node-cache')

/**
 * This plugins returns cached response from the only available route
 */
module.exports = fp(async function (fastify, opts) {
  const { CACHE_MAX_AGE: maxAge } = opts

  const cache = new NodeCache({
    stdTTL: maxAge
  })

  fastify.addHook('onRequest', (request, reply, next) => {
    if (request.method !== 'GET') return next()

    const identifier = Buffer.from(request.url).toString('base64')

    const cachedValue = cache.get(identifier)

    if (!cachedValue) {
      return next()
    }

    return reply
      .status(200)
      .send(cachedValue)
  })

  fastify.addHook('onSend', (request, reply, payload, next) => {
    if (request.method !== 'GET') return next()

    const identifier = Buffer.from(request.url).toString('base64')

    cache.set(identifier, payload)

    next()
  })
})
