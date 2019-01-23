const uuidv4 = require('uuid/v4');

// db & utils
const { attemptsDB } = require('../db');
const { getEmoji, logger } = require('../utils');

module.exports = message => {
	attemptsDB.mostRecentAttempts()
		.then(res => {
			if (res.length > 0) {
				const evoMindFlwns = getEmoji('evoMindFlwns');
				const pepeHands = getEmoji('PepeHands');
				message.channel.send('\`\`\`md\n#Last 343 results\`\`\`' + `${res.map(attempt => {
					return `${attempt.emoji ? attempt.emoji : ''} **${attempt.username}** ${attempt.success ? 'made' : 'missed' } 343 by ${attempt.seconds_left} seconds${attempt.success ? '! ' : '... '} ${attempt.success ? evoMindFlwns : pepeHands}\n`
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
			message.channel.send(`Something went wrong! I dunno, ask webs, I'm just a bot.\nid: ${errId}`);
		});
}