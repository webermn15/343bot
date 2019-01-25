const uuidv4 = require('uuid/v4');

//utils
const { logger } = require('../utils');

module.exports = message => {
	message.channel.send('\`\`\`md\n# Available Commands\n< !stats => returns your 343 statistics\n< !set_emoji [emoji] => associates an [emoji] with your results, or removes one when called with no argument\n< !leaderboard => returns server 343 leaderboard\n< !last => returns all attempts at the most recent possible 343, including seconds remaining\`\`\`')
			.catch(err => {
				errId = uuidv4();
				logger.log('error', `${err} , id:${errId}`);
			});
}