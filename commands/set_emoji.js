const uuidv4 = require('uuid/v4');

// db & utils
const { usersDB } = require('../db');
const { getEmoji, logger } = require('../utils');

module.exports = (message, arg) => {
	const id = message.author.id.toString();
	if (!arg) {
		usersDB.setUserEmoji(null, id)
			.then(res => {
				message.channel.send(`**Emoji removed.**`)
					.catch(err => {
						errId = uuidv4();
						logger.log('error', `${err} , id:${errId}`);
					});
			})
			.catch(err => {
				errId = uuidv4();
				logger.log('error', `${err} , id:${errId}`);
				message.channel.send(`**Something went wrong!** I dunno, ask webs, I'm just a bot.\nid: ${errId}`)
					.catch(err => {
						errId = uuidv4();
						logger.log('error', `${err} , id:${errId}`);
					});
			});
	}
	else {
		const isEmoji = !!getEmoji(arg);
		if (isEmoji) {
			const emoji = getEmoji(arg);
			usersDB.setUserEmoji(emoji, id)
				.then(res => {
					message.channel.send(`**Emoji set** to ${emoji}`)
						.catch(err => {
							errId = uuidv4();
							logger.log('error', `${err} , id:${errId}`);
						});
				})
				.catch(err => {
					errId = uuidv4();
					logger.log('error', `${err} , id:${errId}`);
					message.channel.send(`**Something went wrong!** I dunno, ask webs, I'm just a bot.\nid: ${errId}`)
						.catch(err => {
							errId = uuidv4();
							logger.log('error', `${err} , id:${errId}`);
						});
				});
		}
		else {
			message.channel.send('\`\`\`md\n#Error\`\`\`' + `\n**That's not a recognized server emoji!**\n(Capitalization matters, this server's emojis only, no colons wrapping the emoji name)`)
				.catch(err => {
					errId = uuidv4();
					logger.log('error', `${err} , id:${errId}`);
				});
		}
	}
}