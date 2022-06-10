'use strict'
const getSchema = require('./get.thermometer.schema.json')

const options = {
  schema: getSchema
}

module.exports = async function (fastify, opts) {
  fastify.get('/', options,  async (request, reply) => {

    const { city, operator, temperature } = request.query

    let result = await fastify.thermometerService.isTemp(city, operator, temperature)

    return { data: result }
  })
}
