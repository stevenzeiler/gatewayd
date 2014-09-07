var winston = require('winston');
var config = require(__dirname + '/../../config/config.js');
require('winston-loggly');

winston.add(winston.transports.File, { filename: __dirname + '../../../logs/' + config.get('ENVIRONMENT') + '.log' });

if (config.get('LOGGLY')) {
  winston.add(winston.transports.Loggly, {
    subdomain: config.get('LOGGLY').subdomain,
    auth: config.get('LOGGLY').auth,
    inputToken: config.get('LOGGLY').inputToken
  });
}

global.logger  = winston;
module.exports = winston;
