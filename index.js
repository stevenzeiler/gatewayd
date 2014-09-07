var requireAll = require('require-all-to-camel');

exports.config = require(__dirname + '/config/config.js');
exports.data   = require(__dirname +'/lib/data/');
exports.errors = requireAll(__dirname+'/lib/errors/');
exports.server = require(__dirname+'/lib/app.js');

require(__dirname+'/Gatewaydfile')(exports);
