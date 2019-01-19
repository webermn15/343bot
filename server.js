require('dotenv').config()
const sqlite3 = require('sqlite3').verbose();
const Promise = require('bluebird');
const moment = require('moment');
const Discord = require('discord.js');
const client = new Discord.Client();

// utils
// for logging
const winston = require('winston');
const uuidv4 = require('uuid/v4');
// for handling specific functions
const boardMaker = require('./utils/boardMaker');
const statMaker = require('./utils/statMaker');
const limitSpam = new Discord.Collection();
// setup winston logger
const logger = winston.createLogger({
    level: 'info',
    format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.printf(info => {
            return `${info.timestamp} ${info.level}: ${info.message}`;
        })
    ),
    transports: [new winston.transports.File({
      filename: 'info.log',
      level: 'info'
    })]
});


// db classes
const AppDB = require('./db/AppDB');
const Users = require('./db/Users');
const Attempts = require('./db/Attempts');

// instantiate db classes
const sqliteDB = './db/live.db';
const app = new AppDB(sqliteDB);
const usersDB = new Users(app);
const attemptsDB = new Attempts(app);


// emoji query HoF
const getEmoji = (emj) => client.emojis.find(v => v.name === emj).toString();

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
		const miguel = getEmoji('Miguel');
		message.channel.send('\`\`\`md\n#Error\`\`\`' + `\n${miguel} Command '**${commandAndArg[0]}**' not recognized. Type **!commands** to see available commands.`);
	}
}

// queries data and assembles response
// this is mostly if else statements and really annoying template literal formatting
const commandHandler = (message, command, arg) => {
	if (command === 'commands') {
		message.channel.send('\`\`\`md\n# Available Commands\n< !stats => returns your 343 statistics\n< !set_emoji [emoji] => associates an [emoji] with your results, or removes one when called with no argument\n< !leaderboard => returns server 343 leaderboard\n< !failureboard => returns server 343 failureboard\n< !last => returns all attempts at the most recent possible 343, including seconds remaining\`\`\`');

	}
	else if (command === 'stats') {
		const id = message.author.id.toString();
		usersDB.getUserStats(id)
			.then(res => {
				const user = statMaker(res)[0];
				const dame = getEmoji('TheReal5');
				const scruntgasm = getEmoji('scruntGASM');
				const notLikeDame = getEmoji('NotLikeDame');
				const monkaS = getEmoji('monkaS');
				const pog = getEmoji('Pog');
				message.channel.send('\`\`\`md\n#343 Stats\`\`\`' + 
					`${user.emoji ? user.emoji : ''} **${user.username}** \n:map: **Time Zone** ${user.time_zone}\n${dame} **Total 343s** -- ${user.success}\n${scruntgasm} **Avg seconds left in 343** -- ${user.seconds_left.reduce((x, y) => x + y)/user.seconds_left.length}s\n${notLikeDame} **Total 344s** -- ${user.failed}\n${monkaS} **Avg seconds 343 missed by** -- ${user.seconds_missed.reduce((x, y) => x + y)/user.seconds_missed.length}s\n${pog} **True 343s** -- ${user.true_post}`);
			})
			.catch(err => {
				errId = uuidv4();
				logger.log('error', `${err} , id:${errId}`);
				const sponge = getEmoji('spongebob_with_a_gun');
				message.channel.send('\`\`\`md\n#Error\`\`\`' + `\n${sponge} **There was an error retrieving your stats.**\nYou may not have any 343 data available!! If you think this is an error please message Webs, I'm just doing my job.\n\nid: ${errId}`)
			});

	}
	else if (command === 'set_emoji') {
		const id = message.author.id.toString();
		if (!arg) {
			usersDB.setUserEmoji(null, id)
				.then(res => {
					message.channel.send(`**Emoji removed.**`);
				})
				.catch(err => {
					errId = uuidv4();
					logger.log('error', `${err} , id:${errId}`);
					message.channel.send(`Something went wrong! I dunno, ask Webs, I'm just a bot.\nid: ${errId}`)
				});
		}
		else {
			const isEmoji = client.emojis.find(v => v.name === arg);
			if (isEmoji) {
				const emoji = isEmoji.toString();
				usersDB.setUserEmoji(emoji, id)
					.then(res => {
						message.channel.send(`**Emoji set** to ${emoji}`);
					})
					.catch(err => {
						errId = uuidv4();
						logger.log('error', `${err} , id:${errId}`);
						message.channel.send(`Something went wrong! I dunno, ask Webs, I'm just a bot.\nid: ${errId}`)
					});
			}
			else {
				message.channel.send('\`\`\`md\n#Error\`\`\`' + `**That's not a recognized emoji!** (Capitalization matters)`)
			}
		}
	}
	else if (command === 'leaderboard') {
		attemptsDB.leaderboard()
			.then(res => {
				const formattedLeaderboard = boardMaker(res).sort((x, y) => y.success - x.success);
				message.channel.send('\`\`\`md\n<Leaderboard < Successful attempts >< Successful true attempts >< Avg secs left >\`\`\`' + 
					`\n${formattedLeaderboard.map((user, i) => `${user.emoji ? user.emoji : '[' + (i + 1) + ']:'} **${user.username}** ${'-----------------------------------'.slice(user.username.length)} ${user.success} ${'-----------------------------------'} ${user.true_post} ${'--------------------'} ${user.seconds_left.reduce((x, y) => x + y)/user.seconds_left.length}s \n\n`).join('')}`);})
			.catch(err => {
				logger.log('error', err);
				message.channel.send(`Something went wrong! I dunno, ask Webs, I'm just a bot.`)
			});

	}
	else if (command === 'failureboard') {
		attemptsDB.failureboard()
			.then(res => {
				const formattedLeaderboard = boardMaker(res).sort((x, y) => y.success - x.success);
				message.channel.send('\`\`\`md\n<Failureboard < Failed attempts >< Failed true attempts >< Avg secs missed by >\`\`\`' + 
					`\n${formattedLeaderboard.map((user, i) => `${user.emoji ? user.emoji : '[' + (i + 1) + ']:'} **${user.username}** ${'-----------------------------------'.slice(user.username.length)} ${user.success} ${'-----------------------------------'} ${user.true_post} ${'--------------------'} ${user.seconds_left.reduce((x, y) => x + y)/user.seconds_left.length}s \n\n`).join('')}`);})
			.catch(err => {
				errId = uuidv4();
				logger.log('error', `${err} , id:${errId}`);
				message.channel.send(`Something went wrong! I dunno, ask Webs, I'm just a bot.\nid: ${errId}`)
			});

	}
	else if (command === 'last') {
		attemptsDB.mostRecentAttempts()
			.then(res => {
				if (res.length > 0) {
					const evoMindFlwns = getEmoji('evoMindFlwns');
					const pepeHands = getEmoji('PepeHands');
					message.channel.send('\`\`\`md\n#Last 343 results\`\`\`' + `${res.map(attempt => {
						return `${attempt.emoji ? attempt.emoji : ''} **${attempt.username}** ${attempt.success ? 'succeeded' : 'failed' } in posting 343 on time by ${attempt.seconds_left} seconds! ${attempt.success ? evoMindFlwns : pepeHands} It was ${!attempt.true_post ? 'not' : null } a true 343 attempt${attempt.true_post ? '!' : '.'}\n`
					}).join('')}`)
				}
				else {
					const emoji = getEmoji('hlizard');
					message.channel.send('\`\`\`md\n#Last 343 results\`\`\`' + `\n${emoji} **Nobody attempted the last 343!** ${emoji}`);
				}
			})
			.catch(err => {
				errId = uuidv4();
				logger.log('error', `${err} , id:${errId}`);
				message.channel.send(`Something went wrong! I dunno, ask Webs, I'm just a bot.\nid: ${errId}`)
			});

	}
}


client.on('ready', () => {
	console.log('Discord client ready')
	logger.log('info', 'Discord client ready');
});


client.on('message', (message) => {
	const minutePosted = message.createdAt.getMinutes() === 43 || message.createdAt.getMinutes() === 44 ? message.createdAt.getMinutes() : null;
	const poster = message.author.id.toString();

	// log all attempted 343 posts at 343 and 344
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

	// if (message.content.startsWith('!')) {
	// 	commandChecker(message);
	// }
});

client.on('reconnecting', () => {
	console.log('Discord client reconnecting...');
	logger.log('warn', 'Discord client reconnecting...');
});

client.login(process.env.DISCORD_BOT_TOKEN);