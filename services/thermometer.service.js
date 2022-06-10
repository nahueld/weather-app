'use strict'
const fp = require('fastify-plugin')
const ApiError = require('../utils/api-error')
const ERRORS = require('../utils/errors.json')
class ThermometerService {
  constructor (db, client, opts) {
    this.opts = opts
    this.db = db
    this.client = client
  }

  async isTemp (city, operator, temperature) {
    const data = this.db.get('cities').find({ identifier: city }).value()

    if (!data) throw new ApiError(ERRORS.CITY_NOT_FOUND)

    const { lat, lon } = data

    const response = await this.client.request({
      url: this.opts.OPEN_WEATHER_URL,
      method: 'GET',
      params: {
        lat,
        lon,
        appid: this.opts.OPEN_WEATHER_API_KEY,
        exclude: 'minutely,hourly,daily,alerts',
        units: 'metric'
      }
    })
      .catch((error) => {
        const { status, statusText } = error.response
        throw new ApiError({ statusCode: status, error: statusText, ...ERRORS.OPEN_WEATHER_ISSUE })
      })

    const { current: { temp: currentTemp } } = response.data

    switch (operator) {
      case '$lt': {
        return currentTemp < temperature
      }
      case '$lte': {
        return currentTemp <= temperature
      }
      case '$eq': {
        return currentTemp === temperature
      }
      case '$gte': {
        return currentTemp >= temperature
      }
      case '$gt': {
        return currentTemp > temperature
      }
      default:
        return false
    }
  }
}

module.exports = fp(async function (fastify, opts) {
  if (!fastify.db) throw new Error('DB is not initialized')

  const thermometerService = new ThermometerService(fastify.db, fastify.axios, opts)

  fastify.decorate('thermometerService', thermometerService)
})
