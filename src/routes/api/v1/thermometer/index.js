'use strict'

const getOptions = {
  schema: {
    querystring: {
      type: 'object',
      required: ['city', 'operator', 'temperature'],
      properties: {
        city: {
          type: 'string'
        },
        operator: {
          type: 'string',
          pattern: '^\\$(lt|lte|eq|gt|gte)'
        },
        temperature: {
          type: 'integer'
        }
      }
    },
    response: {
      200: {
        type: 'object',
        properties: {
          data: {
            type: 'boolean'
          }
        }
      },
      default: {
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

module.exports = async function (fastify, opts) {
  fastify.get('/', getOptions, async (request, reply) => {
    const { city, operator, temperature } = request.query

    const result = await fastify.thermometerService.checkTemperature(city, operator, temperature)

    reply.send({ data: result })
  })
}
