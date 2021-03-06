// db class declarations 
const AppDB = require('./AppDB');
const Users = require('./Users');
const Attempts = require('./Attempts');

// db file
const sqliteDB = process.env.PROD_ENV ? './db/live.db' : './db/test.db';

// instantiate db classes
const app = new AppDB(sqliteDB);
const usersDB = new Users(app);
const attemptsDB = new Attempts(app);

module.exports = {
	usersDB,
	attemptsDB
}