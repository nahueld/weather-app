'use strict'

const path = require('path')
const AutoLoad = require('@fastify/autoload')
const fastifyEnv = require('@fastify/env')
const fasitfyAxios = require('fastify-axios')

module.exports = async function (fastify, opts) {

  fastify.register(fasitfyAxios)

  const schema = {
    type: 'object',
    required: ['DB_PATH', 'OPEN_WEATHER_API_KEY', 'OPEN_WEATHER_URL'],
    properties: {
      DB_PATH: {
        type: 'string',
        default: './db.json'
      },
      OPEN_WEATHER_API_KEY: {
        type: 'string'
      },
      OPEN_WEATHER_URL: {
        type: 'string',
        default: 'https://api.openweathermap.org/data/2.5/onecall'
      }
    }
  }

  fastify
    .register(fastifyEnv, { schema })
    .after((err) => {

      if(err) throw new Error(err)
  
      fastify.register(AutoLoad, {
        dir: path.join(__dirname, 'plugins'),
        options: Object.assign({ ...fastify.config }, opts)
      })
      .after((err) => {

        if(err) throw new Error(err)

        fastify.register(AutoLoad, {
          dir: path.join(__dirname, 'services'),
          options: Object.assign({ ...fastify.config }, opts)
        })

      })
  
      fastify.register(AutoLoad, {
        dir: path.join(__dirname, 'routes'),
        options: Object.assign({ ...fastify.config }, opts)
      })

    })

}
