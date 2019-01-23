const uuidv4 = require('uuid/v4');

// db & utils
const { attemptsDB } = require('../db');
const { boardMaker, roundResult, logger } = require('../utils');

module.exports = message => {
	attemptsDB.failureboard()
		.then(res => {
			const formattedLeaderboard = boardMaker(res, true).sort((x, y) => y.success - x.success);
			message.channel.send('\`\`\`md\n<Failureboard < Failed attempts > < Avg secs missed by >\`\`\`' + 
				`\n${formattedLeaderboard.map((user, i) => `${user.emoji ? user.emoji : '[' + (i + 1) + ']:'} **${user.username}** ${'-----------------------------------'.slice(user.username.length)} ${user.success} ${'--------------------'} ${user.seconds_left.length > 0 ? roundResult(user.seconds_left.reduce((x, y) => x + y)/user.seconds_left.length) : 'User has not hit any 344'}s \n\n`).join('')}`);})
		.catch(err => {
			errId = uuidv4();
			logger.log('error', `${err} , id:${errId}`);
			message.channel.send(`Something went wrong! I dunno, ask webs, I'm just a bot.\nid: ${errId}`);
		});
}