var data = require(__dirname+'/../data/');
var getHostedAddress = require(__dirname+'/get_hosted_address.js');
var config = require(__dirname+'/../../config/config.js');

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

function recordIncomingPayment(opts, callback) {
  getHostedAddress(opts.destinationTag, function(error, address) {
    if (error && callback) {
      callback(error, null);
      return;
    }

    data.rippleTransactions.create({
        to_amount: opts.amount,
        to_currency: opts.currency,
        to_issuer: config.get('COLD_WALLET'),
        from_address_id: 0,
        to_address_id: address.id,
        transaction_state: opts.transaction_state,
        state: opts.state,
        transaction_hash: opts.hash
      }, function(error, rippleTransaction) {
        if (callback) {
          if (error) {
            callback(error, null);
            return;
          }

          callback(null, rippleTransaction);
        }
    });
  });
}

module.exports = recordIncomingPayment;

