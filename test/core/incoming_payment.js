var assert = require("assert");
var IncomingPayment = require(__dirname+'/../../lib/core/incoming_payment.js');
var sourceAddressRecord, destinationAddressRecord, rippleTransactionRecord;
var rippleRestPaymentFixture = require(__dirname+'/../fixtures/ripple_rest_payment.json');
var async = require('async');

describe("Incoming Payment", function() {

  it("should be initialized from a ripple rest response", function() {
    incomingPayment = new IncomingPayment(rippleRestResponse.payment);
    assert(incomingPayment instanceof IncomingPayment);
  });

  it("should find or create a destination address record", function(next) {
    incomingPayment = new IncomingPayment(rippleRestResponse.payment);
    incomingPayment.getDestinationAddressRecord(function(error, address) {
      assert(!error);
      assert.strictEqual(address.address, 'r4EwBWxrx5HxYRyisfGzMto3AT8FZiYdWk');
      assert.strictEqual(address.tag, 558);
      assert(address.id > 0);
      destinationAddressRecord = address;
      next();
    });
  });

  it("should find or create a source address record", function(next) {
    incomingPayment = new IncomingPayment(rippleRestResponse.payment);
    incomingPayment.getSourceAddressRecord(function(error, address) {
      assert (!error);
      assert.strictEqual(address.address, 'rsKFYMCrvW5ufUFwh6sH3DPuKhkFePLuyg');
      assert.strictEqual(address.tag, 9933);
      assert(address.id > 0);
      sourceAddressRecord = address;
      next();
    });
  });

  it("should record a ripple transaction record", function(next) {
    incomingPayment = new IncomingPayment(rippleRestResponse.payment);
    incomingPayment.getRippleTransactionRecord(function(error, transaction) {
      assert(!error);
      assert.strictEqual(transaction.to_address_id, destinationAddressRecord.id);
      assert.strictEqual(transaction.from_address_id, sourceAddressRecord.id);
      assert.strictEqual(transaction.to_amount, '1.759');
      assert.strictEqual(transaction.from_amount, '1.759');
      assert.strictEqual(transaction.to_currency, 'DOG');
      assert.strictEqual(transaction.from_currency, 'DOG');
      assert.strictEqual(transaction.to_issuer, 'rsKFYMCrvW5ufUFwh6sH3DPuKhkFePLuyg');
      assert.strictEqual(transaction.from_issuer, 'rMpPEZcKYjYyfTyesrYWi5VV6wcy5mTxP1');
      assert.strictEqual(transaction.transaction_hash, 'F5B8BF7EC1BA385D0544FDD01D3CDE1D0840D2B634DD07BB5AD1C827E6628CF4');
      assert.strictEqual(transaction.transaction_state, 'tesSUCCESS');
      assert.strictEqual(transaction.state, 'incoming');
      rippleTransactionRecord = transaction; 
      next();
    });
  });

  after(function(next) {
    async.parallel([
      function(next) {
        sourceAddressRecord.destroy().complete(next);
      }, 
      function(next) {
        destinationAddressRecord.destroy().complete(next);
      }, 
      function(next) {
        rippleTransactionRecord.destroy().complete(next);
      } 
    ], next);
  });

  before(function() {
    rippleRestResponse = rippleRestPaymentFixture;
  })
});
