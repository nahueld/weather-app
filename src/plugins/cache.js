'use strict'

const fp = require('fastify-plugin')
const NodeCache = require('node-cache')
const uidSafe = require('uid-safe')

function onRequest (cache) {
  return (request, reply, next) => {
    if (request.method !== 'GET') return next()

    const cacheControl = request.headers['cache-control'] || String()

    const cacheControlOpts = cacheControl.split(' ')

    if (cacheControlOpts.includes('no-cache')) return next()

    const eTag = request.headers['if-none-match']

    if (!eTag) return next()

    const cachedValue = cache.get(eTag)

    if (!cachedValue) return next()

    return reply
      .status(304)
      .send()
  }
}

function onSend (cache, maxAge) {
  return (request, reply, payload, next) => {
    if (request.method !== 'GET') return next()

    if (reply.statusCode === 304) return next()

    const eTag = uidSafe.sync(18)

    cache.set(eTag, payload)

    reply.header('cache-control', `max-age=${maxAge} s-maxage=${maxAge} public`)
    reply.header('etag', eTag)

    next()
  }
}

async function cachePlugin (fastify, opts) {
  const { CACHE_MAX_AGE: maxAge } = opts

  const cache = new NodeCache({
    stdTTL: maxAge
  })

  fastify.addHook('onRequest', onRequest(cache))
  fastify.addHook('onSend', onSend(cache, maxAge))
}

/**
 * This plugins returns cached response from the only available route
 */
module.exports = {
  onRequest,
  onSend,
  cachePlugin,
  ...fp(cachePlugin)
}
