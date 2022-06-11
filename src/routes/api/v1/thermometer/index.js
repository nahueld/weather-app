'use strict'

const getOptions = {
  schema: {
    tags: ['thermometer'],
    querystring: {
      type: 'object',
      required: ['city', 'operator', 'temperature'],
      properties: {
        city: {
          type: 'string'
        },
        operator: {
          description: 'One of the following: $lt, $lte, $eq, $gte, $gt',
          type: 'string',
          pattern: '^\\$(lt|lte|eq|gt|gte)'
        },
        temperature: {
          type: 'number'
        }
      }
    },
    response: {
      200: {
        description: 'Successful response',
        type: 'object',
        properties: {
          data: {
            type: 'boolean'
          }
        }
      },
      default: {
        description: 'Error response',
        type: 'object',
        properties: {
          statusCode: {
            type: 'integer'
          },
          error: {
            type: 'string'
          },
          message: {
            type: 'string'
          }
        }
      }
    }
  }
}

module.exports = async function (fastify, opts) {
  fastify.get('/', getOptions, async (request, reply) => {
    const { city, operator, temperature } = request.query

    const result = await fastify.thermometerService.checkTemperature(city, operator, temperature)

    reply.send({ data: result })
  })
}
