const { Router } = require('express')

const ensureAuthenticated = require('../middlewares/ensureAuthenticated')
const TagsController = require('../controllers/TagsController')

const tagsRoutes = Router()

const tagController = new TagsController()

tagsRoutes.get('/', ensureAuthenticated, tagController.index)

module.exports = tagsRoutes
