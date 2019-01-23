const winston = require('winston');

// export winston logger config
module.exports = logger = winston.createLogger({
    level: 'info',
    format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.printf(info => {
            return `${info.timestamp} ${info.level}: ${info.message}`;
        })
    ),
    transports: [new winston.transports.File({
      filename: process.env.PROD_ENV ? 'info.log' : 'dev.log',
      level: 'info'
    })]
});