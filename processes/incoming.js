var Listener = require(__dirname+'/../lib/ripple/listener.js');
var listener = new Listener();

module.exports = function(gatewayd) {

  listener.onPayment = function(payment) {
    gatewayd.logger.info('payment:notification:received', payment);
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
                gatewayd.logger.error('payment:incoming:error', error);
              } else {
                try {
                  gatewayd.logger.info('payment:incoming:recorded', record.toJSON());
                } catch(exception) {
                  gatewayd.logger.error('payment:incoming:error', exception);
                }
              }
            });
          }
        }
      }
    }
  };

  var lastHash = gatewayd.config.get('LAST_PAYMENT_HASH');

  if (lastHash) {
    listener.start(lastHash);
    gatewayd.logger.info('Listening for incoming ripple payments from Ripple REST, starting at', lastHash);
  } else {
    console.log('LAST_PAYMENT_HASH not set... gatewayd is now fetching it from Ripple.');
    gatewayd.api.fetchLastPaymentHash().then(function(hash) {
      gatewayd.config.set('LAST_PAYMENT_HASH', hash)
      gatewayd.config.save(function() {
        listener.start(hash);
        gatewayd.logger.info('Listening for incoming ripple payments from Ripple REST, starting at', hash);
      });
    });
  }

}

