var SqlMqWorker = require('sql-mq-worker');
var OutgoingPaymentProcessor = require(__dirname+'/../lib/core/outgoing_payment_processor.js');

module.exports = function(gatewayd) {

  var gatewayd = require(__dirname+'/../');

  var worker = new SqlMqWorker({
    Class: gatewayd.data.models.rippleTransactions,
    predicate: { where: {
      state: 'outgoing'
    }},
    job: function(outgoingPayment, callback) {
      var outgoingPaymentProcessor = new OutgoingPaymentProcessor(outgoingPayment);
      outgoingPaymentProcessor.processOutgoingPayment(callback);
    }
  });

  worker.start();

  gatewayd.logger.info('Sending Outgoing Payments to Ripple REST at', gatewayd.config.get("RIPPLE_REST_API"));
}

