var data = require(__dirname+'/../data/');
var config = require(__dirname+'/../../config/config.js');
var RippleAddress = data.models.rippleAddresses;

/**@requires data, config
 * @function getHostedAddress
 *
 * @description Queries database for hosted wallet address
 * and creates a record if it doesn't exist.
 *
 * @param tag
 * @param {getHostAddressCallback} callback - Callback that handles the response up on query results or record creation.
 */

function getRippleAddress(options, callback) {
  var coldWallet = config.get('COLD_WALLET');
  var hotWallet = config.get('HOT_WALLET').address;
  var rippleAddress = {
    address: options.address,
    tag: options.tag,
    managed: false,
    type: 'independent'
  };

  if (options.address == coldWallet || options.address == hotWallet) {
    rippleAddress.managed = true;
  }

  switch (options.address) {
    case coldWallet:
      rippleAddress.type = 'hosted';
      break;
    case hotWallet:
      rippleAddress.type = 'hot';
  }

  RippleAddress.findOrCreate(rippleAddress).complete(function(error, rippleAddress){
    if (error) {
      return callback(error, null);
    }
    callback(null, rippleAddress);
  });
}

module.exports = getRippleAddress;

