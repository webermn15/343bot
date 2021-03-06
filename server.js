require('dotenv').config();
const fs = require('fs');
const path = require('path');
const uuidv4 = require('uuid/v4');
const moment = require('moment');
const Discord = require('discord.js');
const client = new Discord.Client();

// export client for utils that need it... hmmm idk if good
module.exports = client;

// db imports
const { attemptsDB, usersDB } = require('./db');

// utils
const { logger, getEmoji } = require('./utils');

// collection declarations
const limitSpam = new Discord.Collection();
const commandList = new Discord.Collection();

// import and format commands into command collection
const commandPath = './commands';
const commandFiles = fs.readdirSync(commandPath);

for (let i = 0; i < commandFiles.length; i++) {
	const commandName = path.parse(commandFiles[i]).name;
	const commandFunc = require(`./commands/${commandName}`)
	commandList.set(commandName, commandFunc);
}


// breaks down user input, checks for validity, handles execution
const commandChecker = (message) => {
	// remove leading `!`
	const cleanCommand = message.content.slice(1);
	// split up words based on spaces
	const splitUp = cleanCommand.split(' ');
	// remove empty strings
	const commandAndArg = splitUp.filter(Boolean);
	// get command from collection
	const command = commandList.get(commandAndArg[0])

	if (!command) {
		const miguel = getEmoji('Miguel');
		message.channel.send('\`\`\`md\n#Error\`\`\`' + `\n${miguel} Command '**${commandAndArg[0]}**' not recognized. Type **!commands** to see available commands.`)
			.catch(err => {
				errId = uuidv4();
				logger.log('error', `${err} , id:${errId}`);
			})
	}
	else {
		commandAndArg.length > 1 ? command(message, commandAndArg[1]) : command(message)
	}
}


client.on('message', (message) => {
	const minutePosted = message.createdAt.getMinutes() === 43 || message.createdAt.getMinutes() === 44 ? message.createdAt.getMinutes() : null;
	const poster = message.author.id.toString();

	// logging all attempted 343 posts at 343 and 344
	if (message.content === '343' && minutePosted && !limitSpam.has(poster)) {
		limitSpam.set(poster, 120000);
		setTimeout(() => limitSpam.delete(poster), 120000);
		const success = minutePosted === 43 ? true : false;
		const username = message.author.username;
		const time_zone = message.createdAt.toString().split(' ').slice(-2).join(' ');
		const date_posted = moment.utc(message.createdAt.toISOString()).format('YYYY-MM-DD HH:MM:SS')
		const seconds_left = success ? 60 - message.createdAt.getSeconds() : message.createdAt.getSeconds();
		const true_post = message.createdAt.getHours() === 3 || message.createdAt.getHours() === 15 ? true : false;

		usersDB.newUserIfNotExist(poster, username, time_zone)
			.then(res => logger.log('info', `new user '${username}' added, id: ${poster}`))
			.catch(err => {
				errId = uuidv4();
				logger.log('error', `${err} , id:${errId}`);
			});

		attemptsDB.newAttempt(poster, date_posted, seconds_left, success, true_post)
			.then(res => logger.log('info', `new attempt logged by ${username}, id: ${poster}`))
			.catch(err => {
				errId = uuidv4();
				logger.log('error', `${err} , id:${errId}`);
			});
	}

	if (message.content.startsWith('!') && message.content.length >= 2) {
		commandChecker(message);
	}
});


client.on('ready', () => {
	console.log('Discord client ready');
	logger.log('info', 'Discord client ready');
});

client.on('reconnecting', () => {
	console.log('Discord client reconnecting...');
	logger.log('warn', 'Discord client reconnecting...');
});

client.login(process.env.DISCORD_BOT_TOKEN);