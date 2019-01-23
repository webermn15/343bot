const uuidv4 = require('uuid/v4');

// db & utils
const { usersDB } = require('../db');
const { getEmoji, statMaker } = require('../utils');

module.exports = message => {
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
				`${user.emoji ? user.emoji : ''} **${user.username}** \n${dame} **Total 343s** -- ${user.success}\n${scruntgasm} **Avg seconds left in 343** -- ${user.seconds_left.length > 0 ? roundResult(user.seconds_left.reduce((x, y) => x + y)/user.seconds_left.length) : 'User has not hit any 343'}s\n${notLikeDame} **Total 344s** -- ${user.failed}\n${monkaS} **Avg seconds 343 missed by** -- ${user.seconds_missed.length > 0 ? roundResult(user.seconds_missed.reduce((x, y) => x + y)/user.seconds_missed.length) : 'User has not hit any 344'}s\n`);
		})
		.catch(err => {
			errId = uuidv4();
			logger.log('error', `${err} , id:${errId}`);
			const sponge = getEmoji('spongebob_with_a_gun');
			message.channel.send('\`\`\`md\n#Error\`\`\`' + `\n${sponge} **There was an error retrieving your stats.**\nYou may not have any 343 data available!! If you think this is an error please message webs, I'm just doing my job.\n\nid: ${errId}`);
		});
}