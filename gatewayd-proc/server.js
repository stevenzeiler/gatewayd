var gateway = require(__dirname + '/../');
var https = require('https');
var fs = require('fs');

var app = require(__dirname+'/../lib/app.js');

var ssl = (gateway.config.get('SSL') && (gateway.config.get('SSL') !== 'false'));

if (ssl) {
  app = https.createServer({
    key: fs.readFileSync(gateway.config.get('SSL_KEY_PATH')),
    cert: fs.readFileSync(gateway.config.get('SSL_CERTIFICATE_PATH'))
  }, app);
}

var host = gateway.config.get('HOST');
var port = gateway.config.get('PORT');
var protocol = ssl ? 'https' : 'http';

app.listen(port, host);

logger.info('Serving REST API and Angular WebApp at', protocol, '://', host, ':', port);

