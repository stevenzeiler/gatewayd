var https = require('https');
var fs = require('fs');
var app = require(__dirname+'/../lib/app.js');

module.exports = function(gatewayd) {

  var ssl = (gatewayd.config.get('SSL') && (gateway.config.get('SSL') !== 'false'));

  if (ssl) {
    app = https.createServer({
      key: fs.readFileSync(gatewayd.config.get('SSL_KEY_PATH')),
      cert: fs.readFileSync(gatewayd.config.get('SSL_CERTIFICATE_PATH'))
    }, app);
  }

  var host = gatewayd.config.get('HOST');
  var port = gatewayd.config.get('PORT');
  var protocol = ssl ? 'https' : 'http';

  app.listen(port, host);

  gatewayd.logger.info('Serving REST API and Angular WebApp at', protocol+'://'+host+':'+port);

}

