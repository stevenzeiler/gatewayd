const gatewayd = require(__dirname+'/../../');
const RippleAddress = gatewayd.models.rippleAddresses;
const assert = require('assert');

describe('RippleAddress model', function() {

  describe('ripple address lastPaymentHash', function() {
    var rippleAddress;
    const HASH = 'alj2o3ij3n21ljn2';
  
    before(function(done) {
      RippleAddress.findOrCreate({
        type: 'independent',
        managed: false,
        address: 'r4EwBWxrx5HxYRyisfGzMto3AT8FZiYdWk'
      }) 
      .then(function(address) {
        rippleAddress = address;
        done();
      });
    });

    it('should set the last payment hash', function(done) {
      rippleAddress.setLastPaymentHash(HASH)
      .then(function() {
        console.log(rippleAddress.toJSON());
        assert.strictEqual(rippleAddress.data.lastPaymentHash, HASH);
        done();
      });
    });

    it('should get the last payment hash', function(done) {
      rippleAddress.getLastPaymentHash()
      .then(function(hash) {
        assert.strictEqual(hash, HASH); 
        done();
      });
    });

    after(function(done) {
      rippleAddress.destroy().then(done);
    });

  });
});
