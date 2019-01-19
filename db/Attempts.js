class Attempts {
	constructor(db) {
		this.db = db;
	}

	newAttempt(poster, date_posted, seconds_left, success, true_post) {
		return this.db.run(
			`INSERT INTO attempts (poster, date_posted, seconds_left, success, true_post) VALUES (?, ?, ?, ?, ?)`, [poster, date_posted, seconds_left, success, true_post]
		)
	}

	mostRecentAttempts() {
		return this.db.all(
			`SELECT username, emoji, date_posted, seconds_left, success, true_post FROM attempts INNER JOIN users ON users.user_id=attempts.poster WHERE date_posted >= datetime('now','-1 hour')`
		)
	}

	allAttemptsByUser(user_id) {
		return this.db.all(
			`SELECT username, emoji, time_zone, date_posted, seconds_left, success, true_post FROM attempts INNER JOIN users ON users.user_id=attempts.poster WHERE users.user_id = ?`, [user_id]
		)
	}

	leaderboard() {
		return this.db.all(
			`SELECT username, emoji, seconds_left, success, true_post FROM attempts INNER JOIN users ON users.user_id=attempts.poster WHERE success = 1`
		)
	}

	failureboard() {
		return this.db.all(
			`SELECT username, emoji, seconds_left, success, true_post FROM attempts INNER JOIN users ON users.user_id=attempts.poster WHERE success = 0`
		)
	}
	
}

module.exports = Attempts;