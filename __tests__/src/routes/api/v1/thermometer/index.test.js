
const { getOptions, getController } = require('../../../../../../src/routes/api/v1/thermometer')
describe('thermometer', () => {
  describe('getOptions', () => {
    it('has the right config', () => {
      expect(getOptions).toStrictEqual({
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
      })
    })
  })

  describe('getController', () => {
    it('it returns boolean', async () => {
      const fastify = {
        thermometerService: {
          checkTemperature: jest.fn().mockReturnValue(Promise.resolve(true))
        }
      }

      const reply = {
        send: jest.fn()
      }

      const query = {
        city: 'abc',
        operator: '$lte',
        temperature: 10
      }

      const request = {
        query
      }

      const handler = getController(fastify)

      await handler(request, reply)

      expect(fastify.thermometerService.checkTemperature).toHaveBeenCalledTimes(1)
      expect(fastify.thermometerService.checkTemperature).toHaveBeenCalledWith(query.city, query.operator, query.temperature)

      expect(reply.send).toHaveBeenCalledTimes(1)
      expect(reply.send).toHaveBeenCalledWith({ data: true })
    })
  })
})
