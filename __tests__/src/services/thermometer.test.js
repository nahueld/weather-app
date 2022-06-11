const axios = require('axios')
const { ThermometerService } = require('../../../src/services/thermometer')

jest.mock('axios')

describe('thermometer', () => {
  describe('ThermometerService', () => {
    describe('checkTemperature', () => {
      it.each([
        // operator, checkedValue, returnedValue, expectedResult
        ['$lt', 13, 12, true],
        ['$lte', 10, 11, false],
        ['$eq', 10, 10, true],
        ['$gte', 10, 10, true],
        ['$gt', 10, 9, false]
      ])('Validates operator: %s', async (operator, checkedValue, returnedValue, expectedResult) => {
        const options = {
          OPEN_WEATHER_URL: 'https://openweather.com/service',
          OPEN_WEATHER_API_KEY: 'abc'
        }

        const fastify = {
          db: {
            get () {
              return {
                find () {
                  return {
                    value () {
                      return {}
                    }
                  }
                }
              }
            }
          },
          axios,
          log: {
            info: jest.fn()
          }
        }

        axios.request.mockResolvedValueOnce({
          data: {
            current: {
              temp: returnedValue
            }
          }
        })

        const service = new ThermometerService(fastify, options)

        const result = await service.checkTemperature('abc', operator, checkedValue)

        expect(result).toBe(expectedResult)
      })

      it('throws error if city not found', async () => {
        const fastify = {
          db: {
            get () {
              return {
                find () {
                  return {
                    value () {
                      return undefined
                    }
                  }
                }
              }
            }
          }
        }

        const service = new ThermometerService(fastify, {})

        let fault

        try {
          await service.checkTemperature('abc', '$eq', -1)
        } catch (err) {
          fault = err
        }

        expect(fault).toBeDefined()

        expect(fault.statusCode).toBe(404)
        expect(fault.error).toBe('Not Found')
        expect(fault.message).toBe('City not found')
      })

      it('throws error service is unavailable', async () => {
        const options = {
          OPEN_WEATHER_URL: 'https://openweather.com/service',
          OPEN_WEATHER_API_KEY: 'abc'
        }

        const fastify = {
          db: {
            get () {
              return {
                find () {
                  return {
                    value () {
                      return {}
                    }
                  }
                }
              }
            }
          },
          axios,
          log: {
            info: jest.fn()
          }
        }

        axios.request.mockRejectedValueOnce({ response: { status: 500, statusText: 'Internal Server Error' } })

        const service = new ThermometerService(fastify, options)

        let fault

        try {
          await service.checkTemperature('abc', '$eq', 1)
        } catch (err) {
          fault = err
        }

        expect(fault.statusCode).toBe(500)
        expect(fault.error).toBe('Internal Server Error')
        expect(fault.message).toBe('Failed to fetch data from Open Weather')
      })

      it('throws error unsupported operator', async () => {
        const options = {
          OPEN_WEATHER_URL: 'https://openweather.com/service',
          OPEN_WEATHER_API_KEY: 'abc'
        }

        const fastify = {
          db: {
            get () {
              return {
                find () {
                  return {
                    value () {
                      return {}
                    }
                  }
                }
              }
            }
          },
          axios,
          log: {
            info: jest.fn()
          }
        }

        axios.request.mockResolvedValueOnce({
          data: {
            current: {
              temp: 20
            }
          }
        })

        const service = new ThermometerService(fastify, options)

        let fault

        try {
          await service.checkTemperature('abc', '$in', 1)
        } catch (err) {
          fault = err
        }

        expect(fault).toBeDefined()

        expect(fault.statusCode).toBe(400)
        expect(fault.error).toBe('Bad Request')
        expect(fault.message).toBe('Invalid operator')
      })
    })
  })
})
