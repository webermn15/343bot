require('dotenv').config()
const sqlite3 = require('sqlite3').verbose();
const Promise = require('bluebird');
const moment = require('moment');
const Discord = require('discord.js');
const client = new Discord.Client();

// db classes
const AppDB = require('./db/AppDB');
const Users = require('./db/Users');
const Attempts = require('./db/Attempts');

//instantiate db classes
const app = new AppDB('./db/test.db');
const usersDB = new Users(app);
const attemptsDB = new Attempts(app);


// breaks down commands and checks for validity
const commandChecker = (message) => {
	// array of available commands
	const commands = ['commands', 'stats', 'leaderboard', 'failureboard', 'last']

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
		return `Command '${commandAndArg[0]}' not recognized. Type !commandlist to see available commands.`
	}
}

// queries data and assembles response
const commandHandler = (message, command, arg) => {
	if (command === 'commands') {

		message.channel.send('\`\`\`md\n# Available Commands #\n< !check [username] => returns 343 statistics for [username]\n< !leaderboard => returns server 343 leaderboard\n< !failureboard => returns server 343 failureboard\`\`\`');

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
				message.channel.send(`${err.message}`)
			});

	}
	else if (command === 'leaderboard') {

		message.channel.send('\`\`\`md\n# Leaderboard #\nyeet\`\`\`');

	}
	else if (command === 'failureboard') {

		message.channel.send('\`\`\`md\n# Leaderboard #\nyeet\`\`\`');

	}
	else if (command === 'last') {

		attemptsDB.mostRecentAttempts()
			.then(res => {
				message.channel.send(`***Results for the last 343:***\n${res.map(attempt => {
					return `${attempt.username} ${attempt.success ? 'succeeded' : 'failed' } in posting 343 on time by ${attempt.seconds_left} seconds! It was ${!attempt.true_post ? '*not*' : null } a true local 343 for them.\n`
				}).join('')}`)
			})
			.catch(err => console.log(err));

	}
}


client.on('ready', () => {
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