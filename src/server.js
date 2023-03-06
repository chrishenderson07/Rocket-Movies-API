require('express-async-errors')
require('dotenv/config')

const migrationsRun = require('./database/sqlite/migrations')

const AppError = require('./utils/AppError')

const cors = require('cors')

const express = require('express')

const routes = require('./routes')

const uploadConfig = require('./configs/upload')

const app = express()
app.use(express.json())

app.use('/files', express.static(uploadConfig.UPLOADS_FOLDER))
app.use(cors())
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

const PORT = process.env.PORT || 3333
app.listen(PORT, () => console.log(`O servidor esta rodando na porta ${PORT}`))
