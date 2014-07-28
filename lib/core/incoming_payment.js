var gateway = require(__dirname+'/../../');
var async = require("async");

function IncomingPayment(rippleRestPayment) {
  this.rippleRestPayment = rippleRestPayment;
}

IncomingPayment.prototype = {
  getRippleTransactionRecord: function(callback) {
    var self = this;
    var destinationAddressRecord, sourceAddressRecord;
    async.parallel([
      function(next) {
        self.getDestinationAddressRecord(function(error, record) {
          if (error) { return next(error, null) }
          destinationAddressRecord = record;
          next();
        })
      },
      function(next) {
        self.getSourceAddressRecord(function(error, record) {
          if (error) { return next(error, null) }
          sourceAddressRecord = record;
          next();
        })
      }
    ], function(error, response) {
      if (error) { return callback(error, null) }
      gateway.data.models.rippleTransactions.create({
        to_address_id: destinationAddressRecord.id,
        from_address_id: sourceAddressRecord.id,
        to_amount: self.rippleRestPayment.destination_amount.value,
        from_amount: self.rippleRestPayment.source_amount.value,
        to_currency: self.rippleRestPayment.destination_amount.currency,
        from_currency: self.rippleRestPayment.source_amount.currency,
        to_issuer: self.rippleRestPayment.destination_amount.issuer,
        from_issuer: self.rippleRestPayment.source_amount.issuer,
        state: 'incoming',
        transaction_state: self.rippleRestPayment.result,
        transaction_hash: self.rippleRestPayment.hash
      }).complete(callback);      
    });
  },

  getDestinationAddressRecord: function(callback) {
    var self = this;
    var destinationType = 
    gateway.data.models.rippleAddresses.findOrCreate({
      address: self.rippleRestPayment.destination_account,
      tag: self.rippleRestPayment.destination_tag,
      type: self._determineDestinationAddressType(),
      managed: self._determineDestinationAddressManaged()
    }).complete(callback);
  },

  getSourceAddressRecord: function(callback) {
    var self = this;
    sourceType = self._determineSourceAddressType();
    gateway.data.models.rippleAddresses.findOrCreate({
      address: self.rippleRestPayment.source_account,
      tag: self.rippleRestPayment.source_tag,
      type: self._determineSourceAddressType(),
      managed: self._determineSourceAddressManaged(),
    }).complete(callback);
  },

  _determineDestinationAddressManaged: function() {
    var managed;
    switch (this.rippleRestPayment.destination_account) {
    case gateway.config.get('COLD_WALLET'):
      managed = true;
      break;
    case gateway.config.get('HOT_WALLET').address:
      managed = true;
      break;
    default:
      managed = false;
    }
    return managed;
  },

  _determineDestinationAddressType: function() {
    var type;
    switch (this.rippleRestPayment.destination_account) {
    case gateway.config.get('COLD_WALLET'):
      type = 'cold';
      break;
    case gateway.config.get('HOT_WALLET').address:
      if (this.rippleRestPayment.destination_tag) {
        type = 'hosted';
      } else {
        type = 'hot';
      }
      break;
    default:
      type = 'independent'
    }
    return type;
  },

  _determineSourceAddressType: function() {
    var type;
    switch (this.rippleRestPayment.source_account) {
    case gateway.config.get('COLD_WALLET'):
      type = 'cold';
      break;
    case gateway.config.get('HOT_WALLET').address:
      if (this.rippleRestPayment.source_tag) {
        type = 'hosted';
      } else {
        type = 'hot';
      }
      break;
    default:
      type = 'independent'
    }
    return type;
  },

  _determineSourceAddressManaged: function() {
    var managed;
    switch (this.rippleRestPayment.source_account) {
    case gateway.config.get('COLD_WALLET'):
      managed = true;
      break;
    case gateway.config.get('HOT_WALLET').address:
      managed = true;
      break;
    default:
      managed = false;
    }
    return managed;
  }

}

module.exports = IncomingPayment;

