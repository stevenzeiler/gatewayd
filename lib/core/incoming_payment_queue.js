
function IncomingPaymentQueue() {

}

IncomingPaymentQueue.prototype = {
  push: function(incomingPayment, callback) {
    incomingPayment.getRippleTransactionRecord(callback);
  }
};

module.exports = IncomingPaymentQueue;

