var nconf = require('nconf');

nconf
  .env();

nconf.defaults({
  'ENVIRONMENT': 'development',
  'SSL': false,
  'SSL_KEY_PATH': null,
  'SSL_CERTIFICATE_PATH': null,
  'BASIC_AUTH_KEY': null,
  'PORT': 5000,
  'HOST': '0.0.0.0',
  'LOGGLY': false,
  'GATEWAYD_PATH': '~/.gatewayd'
});

module.exports = nconf;

