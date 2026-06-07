const bunyan = require('bunyan');

const logger = bunyan.createLogger({
    name: 'SetFit_Backend',
    level: 'info',
});