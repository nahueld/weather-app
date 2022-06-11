'use strict'

const path = require('path')
const AutoLoad = require('@fastify/autoload')
const fastifyEnv = require('@fastify/env')
const fasitfyAxios = require('fastify-axios')
const config = require('./config.json')

module.exports = async function (fastify, opts) {
  const autoLoad = autoLoadFactory(fastify, opts)

  fastify
    .register(fasitfyAxios)
    .register(fastifyEnv, { schema: config })
    .after((err) => {
      if (err) throw new Error(err)
      autoLoad('plugins')
      autoLoad('services')
      autoLoad('routes')
    })
}

function autoLoadFactory (fastify, opts) {
  return (filePath) => {
    return fastify.register(AutoLoad, {
      dir: path.join(__dirname, filePath),
      options: Object.assign({ ...fastify.config }, opts)
    })
  }
}
