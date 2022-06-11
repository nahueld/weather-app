'use strict'

const { test } = require('tap')
const Reply = require('fastify/lib/reply')
const { onRequest, onSend, cachePlugin } = require('../../../src/plugins/cache')
const NodeCache = require('node-cache')

describe('cache', () => {
  describe('onRequest', () => {
    it('method is not GET', () => {
      const cache = {}

      const onRequestHandler = onRequest(cache)

      const request = {
        method: 'POST'
      }
      const reply = {}
      const next = jest.fn()

      onRequestHandler(request, reply, next)

      expect(next.mock.calls.length).toBe(1)
    })

    it('request includes no-cache', () => {
      const cache = {}

      const onRequestHandler = onRequest(cache)

      const request = {
        method: 'GET',
        headers: {
          'cache-control': 'no-cache'
        }
      }
      const reply = {}
      const next = jest.fn()

      onRequestHandler(request, reply, next)

      expect(next.mock.calls.length).toBe(1)
    })

    it('request does not include eTag', () => {
      const cache = {}

      const onRequestHandler = onRequest(cache)

      const request = {
        method: 'GET',
        headers: {}
      }
      const reply = {}
      const next = jest.fn()

      onRequestHandler(request, reply, next)

      expect(next.mock.calls.length).toBe(1)
    })

    it('request includes eTag but it is not cached', () => {
      const cache = new NodeCache()

      cache.set('abc', {})

      const onRequestHandler = onRequest(cache)

      const request = {
        method: 'GET',
        headers: {
          'if-none-match': 'xyz'
        }
      }
      const reply = {}
      const next = jest.fn()

      onRequestHandler(request, reply, next)

      expect(next.mock.calls.length).toBe(1)
    })

    it('request includes eTag and it is cached', () => {
      const cache = new NodeCache()

      cache.set('abc', {})

      const onRequestHandler = onRequest(cache)

      const request = {
        method: 'GET',
        headers: {
          'if-none-match': 'abc'
        }
      }

      const next = jest.fn()

      const sendMock = jest.fn()

      const reply = {
        status: jest.fn(() => ({
          send: sendMock
        }))
      }

      onRequestHandler(request, reply, next)

      expect(next.mock.calls.length).toBe(0)

      expect(reply.status).toHaveBeenCalledWith(304)

      expect(sendMock).toHaveBeenCalled()
    })
  })

  describe('onSend', () => {
    it('method is not GET', () => {
      const cache = {}

      const onSendHandler = onSend(cache)

      const request = {
        method: 'POST'
      }
      const reply = {}
      const next = jest.fn()
      const payload = {}

      onSendHandler(request, reply, payload, next)

      expect(next.mock.calls.length).toBe(1)
    })

    it('reply statusCode is 304', () => {
      const cache = {}

      const onSendHandler = onSend(cache)

      const request = {
        method: 'GET'
      }

      const reply = {
        statusCode: 304
      }

      const payload = {}

      const next = jest.fn()

      onSendHandler(request, reply, payload, next)

      expect(next.mock.calls.length).toBe(1)
    })

    it('reply is cached', () => {
      const cache = new NodeCache()

      const maxAge = 10

      const onSendHandler = onSend(cache, maxAge)

      const request = {
        method: 'GET'
      }

      const reply = {
        header: jest.fn()
      }

      const payload = { a: 'abc' }

      const next = jest.fn()

      onSendHandler(request, reply, payload, next)

      expect(next).toHaveBeenCalledTimes(1)

      expect(reply.header)
        .toHaveBeenCalledTimes(2)

      expect(reply.header).toHaveBeenNthCalledWith(1, 'cache-control', `max-age=${maxAge} s-maxage=${maxAge} public`)
      expect(reply.header).toHaveBeenNthCalledWith(2, 'etag', expect.stringMatching(/.{24}/))
    })
  })
})
