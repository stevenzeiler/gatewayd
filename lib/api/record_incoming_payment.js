var data = require(__dirname+'/../data/');
var getHostedAddress = require(__dirname+'/get_hosted_address.js');
var config = require(__dirname+'/../../config/config.js');
var async = require('async');

/**
* Record incoming payment
* @requires data, getHostedAddress, config
* @param {integer} destinationTag
* @param {string} currency
* @param {decimal} amount 
* @param {string} state 
* @param {string} hash 
* @param {function(error, deposit)} callback
* @returns {Payment}
*/

function RippleTransaction (address, transaction){
  this.to_amount = transaction.amount;
  this.to_currency = transaction.currency;
  this.to_issuer = config.get('COLD_WALLET');
  this.from_address_id = 0;
  this.to_address_id = address.id;
  this.transaction_state = transaction.transaction_state;
  this.state = transaction.state;
  this.transaction_hash = transaction.hash;
};

function _getHostedAddress (options, callback) {
  getHostedAddress(options.destinationTag, function(error, address) {
    if (error) {
      return callback(error, null);
    }
    callback(null, address);
  });
}

function _createRippleTransaction(address, options, callback) {
  var rippleTransaction = new RippleTransaction(address, options);
  data.rippleTransactions.create(rippleTransaction, function(error, rippleTransaction) {
    if (error) {
      return callback(error, null);
    }
    callback(null, rippleTransaction);
  });
}

function recordIncomingPayment(options, callback) {
  async.waterfall([
    function(next){
      _getHostedAddress(options, next);
    },
    function(address, next){
      _createRippleTransaction(address, options, next);
    }
  ], callback);
}

module.exports = recordIncomingPayment;

