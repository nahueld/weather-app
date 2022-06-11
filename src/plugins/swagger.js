const fp = require('fastify-plugin')

module.exports = fp(async function (fastify, opts) {
  fastify.register(require('@fastify/swagger'), {
    routePrefix: '/documentation',
    swagger: {
      info: {
        title: 'Weather App',
        description: 'A super duper weather app to check your nearby cities temperature',
        version: '1.0.0'
      },
      consumes: ['application/json'],
      produces: ['application/json'],
      tags: [
        { name: 'thermometer', description: 'Check the temperature' }
      ]
    },
    uiConfig: {
      docExpansion: 'full',
      deepLinking: false
    },
    exposeRoute: true
  })
})
