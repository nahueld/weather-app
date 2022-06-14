const fastifyAxios = require('fastify-axios')
const { build } = require('fastify-cli/helper')

describe('app', () => {
  let app

  afterEach(() => {
    app && app.close()
  })

  it('fails to start the server due to missing OPEN_WEATHER_API_KEY', async () => {
    let fault

    try {
      await build(['src/app.js'])
    } catch (err) {
      fault = err
    }

    expect(fault).toBeDefined()
    expect(fault.message).toBe("env must have required property 'OPEN_WEATHER_API_KEY'")
  })

  describe('listen', () => {
    beforeAll(async () => {
      process.env.OPEN_WEATHER_API_KEY = 'abc'
      app = await build(['src/app.js'])
      fakeAxios(app)
    })

    it('receives a new weather GET request to check weather', async () => {
      // console.log(ThermometerService.mock.instances)

      const response = await app
        .inject({
          method: 'GET',
          url: '/api/v1/thermometer?city=rio-cuarto&operator=$lt&temperature=21'
        })

      expect(response.statusCode).toBe(200)
      const result = JSON.parse(response.body)
      expect(result.data).toBeTruthy()
    })
  })

  function fakeAxios (app) {
    const symbolKey = Reflect.ownKeys(app)
      .find(key => key.toString() === 'Symbol(fastify.children)')

    const [child] = app[symbolKey]

    child.axios.request = jest.fn()
      .mockResolvedValueOnce({
        data: {
          current: {
            temp: 20
          }
        }
      })
  }
})
