require('express-async-errors')

const migrationsRun = require('./database/sqlite/migrations')

const AppError = require('./utils/AppError')

const express = require('express')

const routes = require('./routes')

const app = express()
app.use(express.json())

app.use(routes)

migrationsRun()

app.use((error, request, response, next) => {
	if (error instanceof AppError) {
		return response.status(error.statusCode).json({
			error: 'error',
			message: error.message,
		})
	}

	console.error(error)

	return response.status(500).json({
		error: 'error',
		message: 'Internal Server Error',
	})
})

const PORT = 2222
app.listen(PORT, () => console.log(`O servidor esta rodando na porta ${PORT}`))
