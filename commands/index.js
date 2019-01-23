const fs = require('fs');
const path = require('path');

// const { usersDB, attemptsDB } = require('../db');

const commandPath = './';
const commandFiles = fs.readdirSync(commandPath);

const commands = commandFiles.map(command => {
	return {
		cmd: path.parse(command).name,
		func: require(`./${command}`)
	}
});

console.log(commands[0].func);