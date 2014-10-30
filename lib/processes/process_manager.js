const requireAll = require('require-all');
var gatewayd = require(__dirname+'/../../');

var processSet = require(__dirname+'/index.js');
var processes = requireAll(__dirname+'/../../processes/');

function ProcessManager() {
  this.processSet = processSet;
  if (gatewayd.config.get('HTTP_SERVER')) {
    this.processSet.add('server');
  }
  if (gatewayd.config.get('RIPPLE_REST_PATH')) {
    this.processSet.add('ripple_rest');
  }
}

ProcessManager.prototype = {
  constructor: ProcessManager,

  start: function() {
    this.processSet.toArray().forEach(function(path) {
      processes[path](gatewayd);
    });
  }
}

module.exports = ProcessManager;

