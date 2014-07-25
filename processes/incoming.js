var gateway = require(__dirname+'/../');

var Listener = require(__dirname+'/../lib/ripple/listener.js');
var listener = new Listener();
var IncomingPayment = require(__dirname+'/../lib/core/incoming_payment.js');

listener.onPayment = function(payment) {
  incomingPayment = new IncomingPayment(payment);
  incomingPayment.queue(function(error, record){
    if (error) {
      logger.error('payment:incoming:error', error);
    } else {
      try {
        logger.info('payment:incoming:recorded', record.toJSON());
      } catch (e) {
        logger.error('payment:incoming:error', e);
      }
    }
  });
};

listener.start(gateway.config.get('LAST_PAYMENT_HASH'));

logger.info('Listening for incoming ripple payments from Ripple REST.');

