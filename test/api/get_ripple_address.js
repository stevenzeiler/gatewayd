var gateway = require(__dirname+'/../../');
var assert = require('assert');


describe('Get or create a ripple address', function(){

  function randomNumber(range) {
    var r = Math.floor(Math.random() * range);
    return r;
  }

  it('should create a new ripple address record with a destination tag', function(done){

    var getRippleAddressParams = {
      address: gateway.config.get('COLD_WALLET'),
      tag: randomNumber(100)
    };

    gateway.api.getRippleAddress(getRippleAddressParams, function(error, rippleAddress){
      newRippleAddress = rippleAddress;
      assert.strictEqual(rippleAddress.dataValues.address, getRippleAddressParams.address);
      assert.strictEqual(rippleAddress.dataValues.tag, getRippleAddressParams.tag);
      assert(rippleAddress.id);
      done();
    });

    after(function(done){
      newRippleAddress.destroy().complete(done);
    });

  });

  it('assert that it finds an existing ripple address record without a destination tag', function(done){
    var getRippleAddressParams = {
      address: gateway.config.get('COLD_WALLET'),
      tag: null
    };

    gateway.api.getRippleAddress(getRippleAddressParams, function(error, rippleAddress){
      newRippleAddress = rippleAddress;
      assert.strictEqual(rippleAddress.dataValues.address, getRippleAddressParams.address);
      assert.strictEqual(rippleAddress.dataValues.tag, null);
      assert(rippleAddress.id);
      done();
    });

  });
});
