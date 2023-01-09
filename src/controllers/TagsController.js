const knex = require('../database/knex')
const { response } = require('express')

class TagsController {
	async index(request, response) {
		const { user_id } = request.params

		const tags = await knex('movie_tags').where({ user_id })

		return response.json(tags)
	}
}

module.exports = TagsController
