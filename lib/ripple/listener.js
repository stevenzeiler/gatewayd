var util = require('util');
var EventEmitter = require('events').EventEmitter;
var Client = require('ripple-rest-client');
var gateway = require(__dirname+'/../../');

var client = new Client({
  api: gateway.config.get('RIPPLE_REST_API'),
  account: gateway.config.get('COLD_WALLET'),
  secret: ''
});

var vent = new EventEmitter();

function pollForPayments(hash, callback) {

  client.getNotification(hash, function(error, notification) {

    if (error) {
      logger.error('listener-payment:incoming:error-1', error);
      setTimeout(function(){
        callback(hash, pollForPayments);
      }, 500);
      return;
    }
    if (notification && notification.next_notification_hash) {
      client.getPayment(notification.next_notification_hash, function(error, payment) {
        if (error) { 
          logger.error('listener-payment:incoming:error-2', error);
          setTimeout(function(){
            callback(hash, pollForPayments);
          }, 500);
        } else {
          vent.emit('payment', payment);

          if (payment) {
            gateway.config.set('LAST_PAYMENT_HASH', payment.hash);

            gateway.config.save(function(){
              callback(notification.next_notification_hash, pollForPayments);
            });
            logger.info('payment:incoming:processed', payment);
          } else {
            callback(notification.next_notification_hash, pollForPayments);
          }
        }
      });
    } else {
      setTimeout(function(){
        callback(hash, pollForPayments);
      }, 500);
    }
  });
}

function Listener() {}

util.inherits(Listener, EventEmitter);

Listener.prototype.start = function(hash) {
  var listener = this;
  vent.on('payment', function(payment) {
    listener.onPayment(payment);
  });
  pollForPayments(hash, pollForPayments);
};

module.exports = Listener;

