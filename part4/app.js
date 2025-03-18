const express = require('express')
const app = express()
require('express-async-errors')
const config = require('./utils/config')
const logger = require('./utils/loggers')
const middleware = require('./utils/middleware')
const mongoose = require('mongoose')
const cors = require('cors')
const blogRouter = require('./controllers/blog')
const usersRouter = require('./controllers/user')
const loginRouter = require('./controllers/login')

mongoose.set('strictQuery', false)

logger.info('connecting to', config.MONGODB_URI)

mongoose.connect(config.MONGODB_URI)
  .then(() => {
    logger.info('connected to MongoDB')
  })
  .catch((error) => {
    logger.error('error connection to MongoDB:', error.message)
  })

app.use(cors())

app.use(express.json())
app.use(middleware.tokenExtractor) // Middleware goes here

app.use('/api/blogs', blogRouter)
app.use('/api/users', usersRouter)
app.use('/api/login', loginRouter)

app.use(middleware.requestLogger)
app.use(middleware.errorHandler)


module.exports = app
