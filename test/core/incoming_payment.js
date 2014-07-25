var assert = require('assert');
var gateway = require(__dirname+'/../..');
var RippleRestClient = require('ripple-rest-client');
var IncomingPayment = require(__dirname+'/../../lib/core/incoming_payment.js');
EXTERNAL_ACCOUNT_SECRET = process.env.EXTERNAL_ACCOUNT_SECRET;

describe('Incoming payment', function(){
  var paymentObject, incomingPayment;

  before(function(done){

    //instantiate rippleTestClient using a test ripple address / secret
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

  it('should queue incoming payment', function(done){
    incomingPayment.queue(function(error, queuedPayment){
      assert.strictEqual(queuedPayment.dataValues.to_amount, paymentObject.payment.source_amount.value);
      assert.strictEqual(queuedPayment.dataValues.to_currency, paymentObject.payment.source_amount.currency);
      assert.strictEqual(queuedPayment.dataValues.transaction_state, 'tesSUCCESS');
      assert.strictEqual(queuedPayment.dataValues.from_issuer, paymentObject.payment.source_account);
      done();
    });

  });

  it('should not queue because payment is duplicate', function(done){
    incomingPayment.queue(function(error, queuedPayment){
      assert.strictEqual(error.severity, 'ERROR');
      assert(error.detail.match(incomingPayment.payment.transaction_hash));
      assert.strictEqual(error.detail.match(incomingPayment.payment.transaction_hash)[0], incomingPayment.payment.transaction_hash);
      done();
    });

  });
});
