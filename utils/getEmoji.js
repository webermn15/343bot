const emojiRegex = require('emoji-regex');
const checkEmoji = emojiRegex();

// seems yikes
const client = require('../server');

module.exports = getEmoji = (emj) => {
	const stringEmoji = client.emojis.find(v => v.name === emj);
	const standardEmoji = checkEmoji.exec(emj);
	const parseServerEmoji = emj.match(/\:(.*?)\:/);
	const serverEmoji = !parseServerEmoji ? null : client.emojis.find(v => v.name === parseServerEmoji[1]);
	let returnedEmoji = null;
	if (!!stringEmoji === true) {
		returnedEmoji = stringEmoji.toString();
	} 
	if (!!standardEmoji === true) {
		returnedEmoji = standardEmoji[0];
	}
	else if (!!serverEmoji === true) {
		returnedEmoji = serverEmoji.toString();
	}
	return returnedEmoji;
}