const Promise = require('bluebird');
const RippleAccountMonitor = require('ripple-account-monitor');
const RippleRestClient = require('ripple-rest-client');
const gatewayd = require(__dirname+'/../');

function getPayments() {

}

var client = Promise.promisifyAll(new RippleRestClient({
  api: gatewayd.config.get('RIPPLE_REST_API'),
  account: gatewayd.config.get('HOT_WALLET').address,
  secret: ''
}));

const monitor = new RippleAccountMonitor({
  rippleRestUrl: gatewayd.config.get('RIPPLE_REST_API'),
  account: gatewayd.config.get('HOT_WALLET').address,
  onTransaction: function(transaction, next) {
    console.log('new transaction', transaction);
    client.getPaymentAsync(transaction.hash)
    .then(function(payment) {
      console.log('payment', payment);

      next();
    })
    .error(function(error) {
      console.log('error', error);
      next();
    });
  },
  onError: function(error) {
    console.log('RippleAccountMonitor::Error', error);
  }
});

monitor.lastHash = 'EF5D38031A961C32D4170A1E7A888D57F553D36F40796C94D27C2497F6722E62';

monitor.start();

