const RippleAccountMonitor = require('ripple-account-monitor');
const RippleRestClient = require('ripple-rest-client');

module.exports = function(gatewayd) {
  const logger = gatewayd.logger;
  const coldWallet = gatewayd.config.get('COLD_WALLET');

  var client = new RippleRestClient({
    api: gatewayd.config.get('RIPPLE_REST_API'),
    account: coldWallet,
    secret: ''
  });

  const monitor = new RippleAccountMonitor({
    rippleRestUrl: gatewayd.config.get('RIPPLE_REST_API'),
    account: coldWallet,
    onTransaction: function(transaction, next) {

      logger.info(transaction);
    },
    onError: function(error) {

      console.log('RippleAccountMonitor::Error', error);
    }
  });

  monitor.lastHash = 'EF5D38031A961C32D4170A1E7A888D57F553D36F40796C94D27C2497F6722E62';
  monitor.start();

  logger.info('Monitoring Ripple for Incoming Payments to '+ coldWallet +'starting at '+monitor.lastHash);
};

