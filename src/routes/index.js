const { Router } = require('express')

const usersRouter = require('./users.routes')
const moviesRoutes = require('./notes.routes')
const tagsRoutes = require('./tags.routes')

const routes = Router()

routes.use('/users', usersRouter)
routes.use('/notes', moviesRoutes)
routes.use('/tags', tagsRoutes)

module.exports = routes
