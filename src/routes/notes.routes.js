const { Router } = require('express')

const MoviesController = require('../controllers/MoviesController')
const ensureAuthenticated = require('../middlewares/ensureAuthenticated')

const moviesRoutes = Router()

const movieController = new MoviesController()

moviesRoutes.use(ensureAuthenticated)

moviesRoutes.get('/', movieController.index)
moviesRoutes.post('/', movieController.create)
moviesRoutes.get('/:id', movieController.show)
moviesRoutes.delete('/:id', movieController.delete)

module.exports = moviesRoutes
