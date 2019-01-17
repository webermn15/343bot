const sqlite3 = require('sqlite3').verbose();
const Promise = require('bluebird');

class AppDB {
	constructor(filePath) {
		this.db = new sqlite3.Database(filePath, err => {
			if (err) {
				return console.log(err.message);
			}
			console.log(`Connected to the ${filePath} database file`)
		})
	}

	run(sql, params = []) {
		return new Promise((resolve, reject) => {
			this.db.run(sql, params, err => {
				if (err) {
					console.log(`error running query ${sql}\n`, err);
					reject(err);
				}
				else {
					resolve({id: this.lastID});
				}
			})
		})
	}

	get(sql, params = []) {
		return new Promise((resolve, reject) => {
			this.db.get(sql, params, (err, result) => {
				if (err) {
					console.log(`error running query ${sql}\n`, err);
					reject(err);
				}
				else {
					resolve(result)
				}
			})
		})
	}

	all(sql, params = []) {
		return new Promise((resolve, reject) => {
			this.db.all(sql, params, (err, rows) => {
				if (err) {
					console.log(`error running query ${sql}\n`, err);
					reject(err);
				}
				else {
					resolve(rows)
				}
			})
		})
	}
}

module.exports = AppDB;