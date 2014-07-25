var data = require(__dirname+'/../data/');
var getRippleAddress = require(__dirname+'/get_ripple_address.js');
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

function _getHostedAddress (options, callback) {
  var query = {
    address: config.get('COLD_WALLET'),
    tag: options.destination_tag
  };

  getRippleAddress(query, function(error, address) {
    if (error) {
      return callback(error, null);
    }
    callback(null, address);
  });
}

function _createRippleTransaction(address, options, callback) {
  options.to_address_id = address.id;
  data.models.rippleTransactions.create(options)
    .complete(function(error, rippleTransaction){
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

