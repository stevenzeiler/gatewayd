var gateway = require(__dirname+'/../../');
var assert = require('assert');
var RippleRestClient = require('ripple-rest-client');
var IncomingPayment = require(__dirname+'/../../lib/core/incoming_payment.js');
EXTERNAL_ACCOUNT_SECRET = process.env.EXTERNAL_ACCOUNT_SECRET;

describe('gateway.api.recordIncomingPayment', function(){

  before(function(done){
    //instantiate rippleTestClient using a test ripple address
    rippleTestClient = new RippleRestClient({
      account: 'rMsQ53ZybFVfys3BF8Sjf5XPRd3LdYDpC3',
      secret: EXTERNAL_ACCOUNT_SECRET
    });

    //build payment object
    paymentObject = {
      payment: {
        source_account: 'rMsQ53ZybFVfys3BF8Sjf5XPRd3LdYDpC3',
        source_amount: { value: '0.002', currency: 'XRP', issuer: '' },
        destination_tag: '2',
        destination_account: gateway.config.get('COLD_WALLET'),
        destination_amount: { value: '0.002', currency: 'XRP', issuer: '' },
        partial_payment: false,
        no_direct_ripple: false
      }
    };

    //send XRP to cold wallet
    rippleTestClient.sendAndConfirmPayment(paymentObject, function(error, response){
      incomingPayment = new IncomingPayment(response);
      done();
    });

  });

  it('should record the incoming payment in the ripple_transactions database table', function(done){
    this.timeout(5000);
    gateway.api.recordIncomingPayment(incomingPayment.payment, function(error, response){
      recordedPayment = response;
      assert.strictEqual(recordedPayment.to_amount, paymentObject.payment.destination_amount.value);
      assert.strictEqual(recordedPayment.to_issuer, gateway.config.get('COLD_WALLET'));
      assert.strictEqual(recordedPayment.to_currency, paymentObject.payment.destination_amount.currency);
      assert.strictEqual(recordedPayment.transaction_hash, incomingPayment.payment.transaction_hash);
      done();
    });
  });

  it('should prevent the recording of incoming payments with redundant transaction hashes', function(done){
    gateway.api.recordIncomingPayment(incomingPayment.payment, function(error, response){
      assert.strictEqual(error.severity, 'ERROR');
      assert(error.detail.match(incomingPayment.payment.transaction_hash));
      assert.strictEqual(error.detail.match(incomingPayment.payment.transaction_hash)[0], incomingPayment.payment.transaction_hash);
      done();
    });
  });

  after(function(done){
    recordedPayment.destroy().complete(done);
  });

});
