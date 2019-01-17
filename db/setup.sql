create table attempts(poster text, date_posted text, seconds_left integer, success boolean, true_post boolean, foreign key(poster) references user(user_id));
create table users(user_id text primary key, username text, time_zone text, unique(user_id));

/* INNER JOIN syntax for sqlite */
select username, time_zone, date_posted, seconds_left, true_post from attempts inner join users on users.user_id = attempts.poster;

/* UPSERT syntax for sqlite */
INSERT INTO users(user_id, username, time_zone) VALUES('86272465868701696','web','GMT-0600 (CST)')
  ON CONFLICT(user_id) DO UPDATE SET username=excluded.username;

/* SELECT recent 343 using datetime method */
SELECT * FROM attempts WHERE date_posted >= datetime('now','-1 hour');

/* INSERT fake date for testing */
INSERT INTO attempts (poster, date_posted, seconds_left, success, true_post) VALUES ('86272465868701696', '2019-01-17 15:01:41', 30, false, false);