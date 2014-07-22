var gateway = require(__dirname+'/../../');
var assert = require('assert');
var RippleRestClient = require('ripple-rest-client');

EXTERNAL_ACCOUNT_SECRET = process.env.EXTERNAL_ACCOUNT_SECRET;

describe('gateway.api.recordIncomingPayment', function(){

  before(function(done){
    //instantiate rippleTestClient using a test an external ripple address
    var rippleTestClient = new RippleRestClient({
      account: 'rMsQ53ZybFVfys3BF8Sjf5XPRd3LdYDpC3',
      secret: EXTERNAL_ACCOUNT_SECRET
    });

    //build payment object
    var options = {
      payment: {
        source_account: 'rMsQ53ZybFVfys3BF8Sjf5XPRd3LdYDpC3',
        source_amount: { value: '.005', currency: 'XRP', issuer: '' },
        destination_tag: '0',
        destination_account: gateway.config.get('COLD_WALLET'),
        destination_amount: { value: '.005', currency: 'XRP', issuer: '' },
        partial_payment: false,
        no_direct_ripple: false
      }
    };

    //send XRP to hot wallet
    rippleTestClient.sendAndConfirmPayment(options, function(error, response){
      successfullPayment = {
        destinationTag: '1',
        transaction_state: response.result,
        hash: response.hash,
        amount: response.destination_amount.value,
        currency: response.destination_amount.currency,
        issuer: response.source_account,
        state: 'incoming'
      };
      done();
    });
  });

  it('should record the incoming payment in the ripple_transactions database table', function(done){
    gateway.api.recordIncomingPayment(successfullPayment, function(error, response){
      assert.strictEqual(response.dataValues.to_amount, successfullPayment.amount);
      assert.strictEqual(response.dataValues.to_issuer, gateway.config.get('COLD_WALLET'));
      assert.strictEqual(response.dataValues.to_currency, successfullPayment.currency);
      assert.strictEqual(response.dataValues.transaction_hash, successfullPayment.hash);
      done();
    });
  });

  it('should prevent the recording of incoming payments with redundant transaction hashes', function(done){
    var payment = {
         destinationTag: '1',
         transaction_state: 'tesSUCCESS',
         hash: 'A5F9ADEADAD10CCF372F8D1752DA29ECC8DF61051D76220FBE4FA78242081C92',
         amount: '1.22',
         currency: 'SWD',
         issuer: 'rMinhWxZz4jeHoJGyddtmwg6dWhyqQKtJz',
         state: 'incoming'
    };
    
    gateway.api.recordIncomingPayment(payment, function(error, response){
      assert.strictEqual(error.severity, 'ERROR');
      assert.strictEqual(error.detail, 'Key (transaction_hash)=(A5F9ADEADAD10CCF372F8D1752DA29ECC8DF61051D76220FBE4FA78242081C92) already exists.');
      done();
    });
  });
});
