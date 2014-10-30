//const gatewayd = require(__dirname+'/../');
const exec = require('child_process').exec;


module.exports = function(gatewayd) {

  const RIPPLE_REST_PATH = gatewayd.config.get('RIPPLE_REST_PATH') || __dirname+'/../node_modules/ripple-rest/';

  logger.info('ripple rest path', RIPPLE_REST_PATH);
   
  if (RIPPLE_REST_PATH) {

    exec('cd '+RIPPLE_REST_PATH+' && node server.js', function(error, stdout) {
      console.log(error, stdout);
      if (error) {
        gatewayd.logger.error(error);
      } else {
        gatewayd.logger.info(stdout);
      }
    });
    logger.info('Running Ripple REST on http://localhost:5990');

  } else {

    logger.error('RIPPLE_REST_PATH not set in configuration');
  }

}

