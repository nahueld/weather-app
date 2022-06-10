'use strict'
const getSchema = require('./get.thermometer.schema.json')

const options = {
  schema: getSchema
}

module.exports = async function (fastify, opts) {
  fastify.get('/', options,  async (request, reply) => {
    return { type: true, fafa: false, data: true }
  })
}
