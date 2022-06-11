# Weather App
This project was bootstrapped with [Fastify-CLI](https://www.npmjs.com/package/fastify-cli).

## Assumptions
The following assumptions were made:
- cache is a public server side cache, it is assumed that the service does not require authentication or stores per-user data
- cache is also in-memory cache on the same server, it does not rely on an external service for this like redis
- cache is assumed to be used on the only endpoint available
- a full data-base is not required for the scope of the excercise, we are using instead a file based database called lowDb to store the cities and the coordinates

## Instructions to run the service
1. Clone the repository
2. Add an `.env` file in the root
3. Add the following environment variable: `OPEN_WEATHER_API_KEY=abc` (instructions on how to obtain the key down below)
4. Run the command `npm run dev``

To obtain the API Key follow the instructions on the [OpenWeather](https://openweathermap.org/price) website, the Free plan is enough.

### Full list of configurable values
The following variables can be set-up on the `.env` file
```
DB_PATH=./db.json //path to a database file, relative to the root of the project
OPEN_WEATHER_API_KEY=abc //the api key needed to interact with the Open Weather API
OPEN_WEATHER_URL=https://abc.com //the endpoint to retrieve current temperature
CACHE_MAX_AGE=1 //the cache configured time in seconds
```

## Tests
To run the tests simply run: `npm run test`

## API Docs
When running the service access: `http://localhost:3000/documentation` to get access to Swagger documentation

## Postman
Also find a postman collection with a default query configured