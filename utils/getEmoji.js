// seems yikes
const client = require('../server');

module.exports = getEmoji = (emj) => client.emojis.find(v => v.name === emj).toString();