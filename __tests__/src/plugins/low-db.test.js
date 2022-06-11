/* eslint-disable n/no-path-concat */
'use strict'

const { lowDbPlugin } = require('../../../src/plugins/low-db')
const low = require('lowdb')
const FileSync = require('lowdb/adapters/FileSync')

describe('low-db', () => {
  describe('lowDbPlugin', () => {
    it('fails to start without path', async () => {
      const fastify = jest.fn()
      const options = {}

      let fault

      try {
        await lowDbPlugin(fastify, options)
      } catch (err) {
        fault = err.toString()
      }

      expect(fault).toBeDefined()

      expect(fault).toBe('Error: DB path is not specified')
    })

    it('fails to start if db not found', async () => {
      const fastify = jest.fn()
      const options = {
        DB_PATH: './some/fake/db.json'
      }

      let fault

      try {
        await lowDbPlugin(fastify, options)
      } catch (err) {
        fault = err.toString()
      }

      expect(fault).toBeDefined()

      expect(fault).toBe('Error: DB file not found')
    })

    it('fastify is decorated with db', async () => {
      const fastify = {
        decorate: jest.fn()
      }

      const path = `${__dirname}/../../../db.json`

      const options = {
        DB_PATH: path
      }

      await lowDbPlugin(fastify, options)

      expect(fastify.decorate).toHaveBeenCalledTimes(1)

      expect(fastify.decorate).toHaveBeenCalledWith('db', expect.anything())
    })
  })
})
