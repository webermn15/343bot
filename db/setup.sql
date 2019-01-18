CREATE TABLE attempts(poster TEXT, date_posted TEXT, seconds_left INTEGER, success BOOLEAN, true_post BOOLEAN, FOREIGN KEY(poster) REFERENCES user(user_id));
CREATE TABLE users(user_id TEXT PRIMARY KEY, username TEXT, emoji TEXT, time_zone TEXT, unique(user_id));

/* INNER JOIN syntax for sqlite */
SELECT username, time_zone, date_posted, seconds_left, true_post FROM attempts INNER JOIN users ON users.user_id = attempts.poster;

/* UPSERT syntax for sqlite */
INSERT INTO users(user_id, username, time_zone) VALUES('86272465868701696','web','GMT-0600 (CST)')
  ON CONFLICT(user_id) DO UPDATE SET username=excluded.username;

/* SELECT recent 343 using datetime method */
SELECT * FROM attempts WHERE date_posted >= datetime('now','-1 hour');

/* INSERT fake date for testing */
INSERT INTO attempts (poster, date_posted, seconds_left, success, true_post) VALUES ('86272465868701696', '2019-01-17 13:44:00', 30, false, false);
INSERT INTO attempts (poster, date_posted, seconds_left, success, true_post) VALUES ('86272465868701696', '2019-01-17 15:43:01', 30, true, true);
INSERT INTO attempts (poster, date_posted, seconds_left, success, true_post) VALUES ('86272465868701696', '2019-01-17 12:44:34', 30, false, false);
INSERT INTO attempts (poster, date_posted, seconds_left, success, true_post) VALUES ('86272465868701696', '2019-01-17 11:44:00', 30, false, false);
INSERT INTO attempts (poster, date_posted, seconds_left, success, true_post) VALUES ('86272465868701696', '2019-01-17 08:43:01', 30, true, true);
INSERT INTO attempts (poster, date_posted, seconds_left, success, true_post) VALUES ('86272465868701696', '2019-01-17 09:43:34', 30, true, false);
INSERT INTO attempts (poster, date_posted, seconds_left, success, true_post) VALUES ('78493876109232475', '2019-01-17 09:43:09', 30, true, false);
INSERT INTO attempts (poster, date_posted, seconds_left, success, true_post) VALUES ('18409576892009836', '2019-01-17 09:43:30', 30, true, false);
INSERT INTO attempts (poster, date_posted, seconds_left, success, true_post) VALUES ('18409576892009836', '2019-01-17 03:43:41', 30, true, true);
INSERT INTO attempts (poster, date_posted, seconds_left, success, true_post) VALUES ('18409576892009836', '2019-01-17 09:43:30', 30, true, false);
INSERT INTO attempts (poster, date_posted, seconds_left, success, true_post) VALUES ('18409576892009836', '2019-01-17 03:43:41', 30, true, true);
INSERT INTO users(user_id, username, time_zone) VALUES('18409576892009836','chroma','GMT-0500 (EST)')
  ON CONFLICT(user_id) DO UPDATE SET username=excluded.username;
INSERT INTO users(user_id, username, time_zone) VALUES('78493876109232475','upke','GMT-0800 (PST)')
  ON CONFLICT(user_id) DO UPDATE SET username=excluded.username;