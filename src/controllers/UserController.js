const AppError = require('../utils/AppError')
const sqliteConnection = require('../database/sqlite')

const { hash, compare } = require('bcryptjs')

class UserController {
	async create(request, response) {
		const { name, email, password } = request.body

		const database = await sqliteConnection()
		//Aqui eu crio uma constante que irá ser usada para validar se o email do usuario ja está em uso
		const checkUserExists = await database.get(
			'SELECT * FROM users WHERE email = (?)',
			[email],
		)

		if (checkUserExists) {
			throw new AppError('O email ja esta em uso')
		}

		// Aqui eu crio a função que criptografa a senha
		const hashedPassword = await hash(password, 8)

		// Aqui eu rodo o método que irá cadastrar o usuário
		await database.run(
			'INSERT INTO users (name, email,password) VALUES (?,?,?)',
			[name, email, hashedPassword],
		)

		return response.status(201).json()
	}

	async update(request, response) {
		const { name, email, password, old_password } = request.body
		const user_id = request.user.id

		const database = await sqliteConnection()
		const user = await database.get('SELECT * FROM users WHERE id = (?)', [
			user_id,
		])

		if (!user) {
			throw new AppError('Usuário não encontrado')
		}

		const userWithUpdatedEmail = await database.get(
			'SELECT * FROM users WHERE email = (?)',
			[email],
		)

		if (userWithUpdatedEmail && userWithUpdatedEmail.id !== user.id) {
			throw new AppError('Já existe um usuário com este email')
		}

		user.name = name ?? user.name
		user.email = email ?? user.email

		if (password && !old_password) {
			throw new AppError(
				'Você precisa informar a senha antiga para definir a nova senha',
			)
		}

		if (password && old_password) {
			const checkOldPassword = await compare(old_password, user.password)

			if (!checkOldPassword) {
				throw new AppError('A senha antiga não confere.')
			}

			user.password = await hash(password, 8)
		}

		await database.run(
			`
		UPDATE users SET
		name = ?,
		email = ?,
		password = ?,
		updated_at = DATETIME('now')
		WHERE id = ?`,
			[user.name, user.email, user.password, user_id],
		)

		return response.status(200).json()
	}
}

module.exports = UserController
