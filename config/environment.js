/* jshint -W079 */

var nconf = require('nconf');

nconf
  .file({ file: __dirname+'/config.json' })
  .env();

nconf.defaults({
  'ENVIRONMENT': 'production',
  'RIPPLE_REST_API': 'https://api.ripple.com/',
  'RIPPLE_REST_PATH': null,
  'DATABASE_USER': 'postgres',
  'DATABASE_PASSWORD': 'password',
  'DATABASE_NAME': 'ripple_gateway',
  'DATABASE_HOST': 'localhost',
  'DATABASE_PORT': '5432',
  // DATABASE_URL supercedes the other DATABASE_* config options.
  // e.g. 'DATABASE_URL': 'postgres://postgres:password@localhost:5432/ripple_gateway',
  //
  // DEPRECATED: Use DATABASE_{USER|PASSWORD|...} instead.
  'DATABASE_URL': null,
  'RIPPLE_DATAMODEL_ADAPTER': 'ripple-gateway-data-sequelize',
  'SSL': true,
  'SSL_KEY_PATH': __dirname+'/../env/certs/server.key',
  'SSL_CERTIFICATE_PATH': __dirname+'/../env/certs/server.crt',
  'HTTP_SERVER': true, // Serve http/json api
  'BASIC_AUTH': true, // Require admin key for http api
  'KEY': false, // Required for BASIC_AUTH
  'USER_AUTH': false, // Enable user routes with name/password basic auth
  'WEBAPP': true,
  'WEBAPP_PATH': __dirname + '/../node_modules/gatewayd-admin/',
  'PORT': 5000, // Port of http api server
  'HOST': 'localhost',
  'DOMAIN': 'example.com', // Domain of gateway, for ripple.txt and auth
  'HOT_WALLET': { address: false, secret: false }, // Required
  'COLD_WALLET': null, // Required
  'CURRENCIES': null, // Required
  'WITHDRAWAL_FEE': 0.01, // Required - default 1%
  'DEPOSIT_FEE': 0.01, // Required - default 1%
  'LOGGLY': false
});

module.exports = nconf;
