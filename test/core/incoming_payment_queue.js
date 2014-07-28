var rippleRestPaymentFixture = require(__dirname+'/../fixtures/ripple_rest_payment.json');
var IncomingPaymentQueue = require(__dirname+'/../../lib/core/incoming_payment_queue.js');
var IncomingPayment = require(__dirname+'/../../lib/core/incoming_payment.js');
var assert = require("assert");

var queuedPaymentCreated;

describe('Incoming Payment Queue', function() { 

  it("should push an incoming payment onto the queue", function(next) {

    var incomingPaymentQueue = new IncomingPaymentQueue();
    var incomingPayment = new IncomingPayment(rippleRestPaymentFixture.payment);

    incomingPaymentQueue.push(incomingPayment, function(error, queuedPayment) {
      console.log(error, queuedPayment);
      queuedPaymentCreated = queuedPayment;
      assert(queuedPayment.id > 0); 
      assert.strictEqual(queuedPayment.transaction_hash, incomingPayment.rippleRestPayment.hash); 
      next();
    });
  });

  after(function(next) {
    queuedPaymentCreated.destroy().complete(next);
  });
});

