const gatewayd = require(__dirname+'/../');
const RippleAddress = gatewayd.models.rippleAddresses;
const Listener = require(__dirname+'/../lib/ripple/listener.js');

var listener = new Listener();

listener.onPayment = function(payment) {
  logger.info('payment:notification:received', payment);
  if (payment && payment.destination_account === gatewayd.config.get('COLD_WALLET')) {
    var opts = {
      destinationTag : payment.destination_tag,
      transaction_state : payment.result,
      hash : payment.hash
    };
    if (opts.destinationTag && (opts.transaction_state === 'tesSUCCESS')){
      if (payment.destination_balance_changes) {
        var balanceChange = payment.destination_balance_changes[0];
        if (balanceChange) {
          opts.amount = balanceChange.value;
          opts.currency = balanceChange.currency;
          opts.issuer = balanceChange.issuer;
          opts.state = 'incoming';
          gatewayd.api.recordIncomingPayment(opts, function(error, record) {
            if (error) {
              logger.error('payment:incoming:error', error);
            } else {
              try {
                logger.info('payment:incoming:recorded', record.toJSON());
              } catch(exception) {
                logger.error('payment:incoming:error', exception);
              }
            }
          });
        }
      }
    }
  }
};

gatewayd.getHotWalletAsync().then(function(address) {
  if (!address) {
    throw new Error('Ripple Hot Wallet not set');
  }
  if (address.getLastPaymentHash()) {
    listener.start(address.getLastPaymentHash()); 
  } else {
    throw new Error('Hot wallet LAST PAYMENT HASH not set');
  }
});

logger.info('Listening for incoming ripple payments from Ripple REST.');

