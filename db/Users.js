class Users {
	constructor(db) {
		this.db = db;
	}

	newUserIfNotExist(user_id, username, time_zone) {
		return this.db.run(
			`INSERT INTO users (user_id, username, time_zone) VALUES (?, ?, ?) ON CONFLICT(user_id) DO UPDATE SET username=excluded.username`, [user_id, username, time_zone]
		)
	}

	getUserIdFromUsername(username) {
		return this.db.get(
			`SELECT * FROM users WHERE username = ?`, [username]
		)
	}

	setUserEmoji(emoji, user_id) {
		return this.db.run(
			`UPDATE users SET emoji = ? WHERE user_id = ?`, [emoji, user_id]
		)
	}

}

module.exports = Users;