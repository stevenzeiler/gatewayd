var gateway = require(__dirname+'/../../');

function RippleTransaction (transaction){
  this.payment = {};
  this.payment.to_amount = transaction.destination_amount.value;
  this.payment.to_currency = transaction.destination_amount.currency;
  this.payment.from_amount = transaction.source_amount.value;
  this.payment.from_currency = transaction.source_amount.currency;
  this.payment.to_issuer = transaction.destination_account;
  this.payment.from_issuer = transaction.source_account;
  this.payment.from_address_id = Number(transaction.source_tag);
  this.payment.transaction_state = transaction.result;
  this.payment.state = 'incoming';
  this.payment.transaction_hash = transaction.hash;
};

RippleTransaction.prototype  = {
  queue: function (callback) {
    var payment = this.payment;
    if (payment.transaction_state === 'tesSUCCESS') {
      gateway.api.recordIncomingPayment(payment, callback);
    }
  }
};

module.exports = RippleTransaction;
