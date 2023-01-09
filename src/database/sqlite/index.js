//sqlite3 é o drive, a versão do sqlite
const sqlite3 = require('sqlite3')
//sqlite é o que iremos usar para nos conectar
const sqlite = require('sqlite')
const path = require('path')

async function sqliteConnection() {
	const database = await sqlite.open({
		filename: path.resolve(__dirname, '..', 'database.db'),
		driver: sqlite3.Database,
	})

	return database
}

module.exports = sqliteConnection
