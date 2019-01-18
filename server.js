require('dotenv').config()
const sqlite3 = require('sqlite3').verbose();
const Promise = require('bluebird');
const moment = require('moment');
const Discord = require('discord.js');
const client = new Discord.Client();

//utils
const boardMaker = require('./utils/boardMaker');

// db classes
const AppDB = require('./db/AppDB');
const Users = require('./db/Users');
const Attempts = require('./db/Attempts');

// instantiate db classes
const app = new AppDB('./db/test.db');
const usersDB = new Users(app);
const attemptsDB = new Attempts(app);


// breaks down commands and checks for validity
const commandChecker = (message) => {
	// array of available commands
	const commands = ['commands', 'stats', 'set_emoji', 'leaderboard', 'failureboard', 'last']

	// remove leading `!`
	const cleanCommand = message.content.slice(1);
	// split up words based on spaces
	const splitUp = cleanCommand.split(' ');
	// remove empty strings
	const commandAndArg = splitUp.filter(Boolean);
	
	// conditional to hand invalid commands
	if (commands.includes(commandAndArg[0])) {
		return commandAndArg.length === 1 ? commandHandler(message, commandAndArg[0]) : commandHandler(message, commandAndArg[0], commandAndArg[1])
	} 
	else {
		message.channel.send(`Command '${commandAndArg[0]}' not recognized. Type !commands to see available commands.`);
	}
}

// queries data and assembles response
const commandHandler = (message, command, arg) => {
	if (command === 'commands') {
		message.channel.send('\`\`\`md\n# Available Commands #\n< !stats => returns your 343 statistics\n< !set_emoji [emoji] => associates an [emoji] with your results, or removes one when called with no argument\n< !leaderboard => returns server 343 leaderboard\n< !failureboard => returns server 343 failureboard\n< !last => returns all attempts at the most recent possible 343, including seconds remaining\`\`\`');

	}
	else if (command === 'stats') {
		usersDB.getUserIdFromUsername(arg)
			.then(user => {
				attemptsDB.allAttemptsByUser(user.user_id)
					.then(stats => {
						console.log(stats)
						message.channel.send(`${arg} has posted 343 at 344 ${stats.length} times. Yikes.`)
					})
					.catch(err => console.log(err))
			})
			.catch(err => {
				console.log(err)
				message.channel.send(`Something went wrong! I dunno, ask Webs, I'm just a bot.`)
			});

	}
	else if (command === 'set_emoji') {
		const id = message.author.id.toString();
		if (!arg) {
			usersDB.setUserEmoji(null, id)
				.then(res => {
					message.channel.send(`Emoji removed.`);
				})
				.catch(err => {
					console.log(err)
					message.channel.send(`Something went wrong! I dunno, ask Webs, I'm just a bot.`)
				});
		}
		else {
			const isEmoji = client.emojis.find(v => v.name === arg);
			console.log(isEmoji);
			if (isEmoji) {
				const emoji = isEmoji.toString();
				usersDB.setUserEmoji(emoji, id)
					.then(res => {
						message.channel.send(`Emoji set to ${emoji}`);
					})
					.catch(err => {
						console.log(err)
						message.channel.send(`Something went wrong! I dunno, ask Webs, I'm just a bot.`)
					});
			}
			else {
				message.channel.send(`That's not a recognized emoji! (Capitalization matters)`)
			}
		}
	}
	else if (command === 'leaderboard') {
		attemptsDB.leaderboard()
			.then(res => {
				const formattedLeaderboard = boardMaker(res).sort((x, y) => y.success - x.success);
				console.log(formattedLeaderboard);
				message.channel.send('\`\`\`md\n<Leaderboard < Successful 343 attempts > < Successful true 343 attempts >\`\`\`' + 
					`\n${formattedLeaderboard.map((user, i) => `${user.emoji ? user.emoji : '[' + (i + 1) + ']:'} ${user.username} ${'-----------------------------------'.slice(user.username.length)} ${user.success} ${'---------------------------------------------'} ${user.true_post}\n\n`).join('')}`);})
			.catch(err => {
				console.log(err)
				message.channel.send(`Something went wrong! I dunno, ask Webs, I'm just a bot.`)
			});

	}
	else if (command === 'failureboard') {
		attemptsDB.failureboard()
			.then(res => {
				console.log(res)
				const formattedLeaderboard = boardMaker(res).sort((x, y) => y.success - x.success);
				console.log(formattedLeaderboard);
				message.channel.send('\`\`\`md\n<Failureboard < Failed 343 attempts > < Failed true 343 attempts >\`\`\`' + 
					`\n${formattedLeaderboard.map((user, i) => `${user.emoji ? user.emoji : '[' + (i + 1) + ']:'} ${user.username} ${'-----------------------------------'.slice(user.username.length)} ${user.success} ${'---------------------------------------------'} ${user.true_post}\n\n`).join('')}`);})
			.catch(err => {
				console.log(err)
				message.channel.send(`Something went wrong! I dunno, ask Webs, I'm just a bot.`)
			});

	}
	else if (command === 'last') {
		attemptsDB.mostRecentAttempts()
			.then(res => {
				if (res.length > 0) {
					message.channel.send('\`\`\`md\n# Last 343 results #\`\`\`' + `${res.map(attempt => {
						return `***${attempt.username}*** ${attempt.success ? 'succeeded' : 'failed' } in posting 343 on time by ${attempt.seconds_left} seconds! It was ${!attempt.true_post ? '*not*' : null } a true 343 attempt${attempt.true_post ? '!' : '.'}\n`
					}).join('')}`)
				}
				else {
					const emoji = client.emojis.find(v => v.name === 'fendywink').toString();
					message.channel.send('\`\`\`md\n# Last 343 results #\`\`\`' + `\n${emoji} Nobody attempted the last 343! ${emoji}`);
				}
			})
			.catch(err => {
				console.log(err)
				message.channel.send(`Something went wrong! I dunno, ask Webs, I'm just a bot.`)
			});

	}
}


client.on('ready', () => {
	debugger;
	console.log('You are not prepared.');
});


client.on('message', (message) => {
	const minutePosted = message.createdAt.getMinutes() === 43 || message.createdAt.getMinutes() === 44 ? message.createdAt.getMinutes() : null;

	// log all attempted 343 posts at 343 and 344
	if (message.content === '343') {
		const success = minutePosted === 43 ? true : false;
		const poster = message.author.id;
		const username = message.author.username;
		const time_zone = message.createdAt.toString().split(' ').slice(-2).join(' ');
		const date_posted = moment.utc(message.createdAt.toISOString()).format('YYYY-MM-DD HH:MM:SS')
		const seconds_left = success ? 60 - message.createdAt.getSeconds() : message.createdAt.getSeconds();
		const true_post = message.createdAt.getHours() === 3 || message.createdAt.getHours() === 15 ? true : false;

		usersDB.newUserIfNotExist(poster, username, time_zone)
			.then(res => console.log(res))
			.catch(err => console.log(err));

		attemptsDB.newAttempt(poster, date_posted, seconds_left, success, true_post)
			.then(res => console.log(res))
			.catch(err => console.log(err));

		message.channel.send(`posted at ${message.createdAt.toString()} local time, ${message.createdAt.toUTCString()} UTC time`);
	}

	if (message.content.startsWith('!')) {
		commandChecker(message);
	}

});


client.login(process.env.DISCORD_BOT_TOKEN);