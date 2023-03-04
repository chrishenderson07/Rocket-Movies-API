const AppError = require('../utils/AppError')

const knex = require('../database/knex')
const { response } = require('express')
class MoviesController {
	async create(request, response) {
		const { title, description, rating, tags } = request.body
		const user_id = request.user.id

		if (rating > 5 || rating < 0) {
			throw new AppError('A avaliação só pode ser feita com números de 0 a 5')
		}

		const movie_id = await knex('movie_notes').insert({
			title,
			description,
			rating,
			user_id,
		})

		const tagsInsert = tags.map((name) => {
			return {
				name,
				movie_id,
				user_id,
			}
		})

		await knex('movie_tags').insert(tagsInsert)
		return response
			.status(201)
			.json({ message: 'Filme adicionado com sucesso' })
	}

	async show(request, response) {
		const { id } = request.params
		const note = await knex('movie_notes').where({ id }).first()

		const tags = await knex('movie_tags')
			.where({ movie_id: id })
			.orderBy('name')
			.groupBy('name')

		return response.json({ ...note, tags })
	}

	async delete(request, response) {
		const { id } = request.params

		await knex('movie_notes').where({ id }).delete()

		return response.json()
	}

	async index(request, response) {
		const { title, tags } = request.query
		const user_id = request.user.id
		let notes

		if (tags) {
			const filterTags = tags.split(',').map((tag) => tag.trim())

			notes = await knex('movie_tags')
				.select(['movie_notes.id', 'movie_notes.title', 'movie_notes.user_id'])
				//Farei outro filtro por que quero utilizar o id do usuario

				.where('movie_notes.user_id', user_id)
				.whereLike('movie_notes.title', `%${title}%`)
				.whereIn('name', filterTags)
				.innerJoin('movie_notes', 'movie_notes.id', 'movie_tags.movie_id')
				.orderBy('movie_notes.title')
		} else {
			notes = await knex('movie_notes')
				.where({ user_id })
				.whereLike('title', `%${title}%`)
				.orderBy('title')
		}

		const userTags = await knex('movie_tags').where({ user_id })

		const notesWithTags = notes.map((note) => {
			const noteTags = userTags.filter((tag) => tag.movie_id === note.id)
			return {
				...note,
				tags: noteTags,
			}
		})

		return response.json(notesWithTags)
	}
}

module.exports = MoviesController
