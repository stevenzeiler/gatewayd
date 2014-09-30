var ExternalAccounts = require(__dirname+'/../../').data.models.externalAccounts;
var assert = require('assert');
var fixtures = require(__dirname+'/../fixtures/models');

var externalAccount;
var validExternalAccount = fixtures.externalAccounts.valid;

describe('External accounts database table', function(){

  it('should successfully create an entry', function(done){
    this.timeout(5000);

    ExternalAccounts.create(validExternalAccount)
    .then(function(account){
      externalAccount = account;
        assert(externalAccount.id);
        assert.strictEqual(externalAccount.dataValues.address, validExternalAccount.address);
        assert.strictEqual(externalAccount.dataValues.type, validExternalAccount.type);
        done();
    })
    .error(console.log);
  });
  
  it('should fail to persist due to duplicate address field', function(done){
    this.timeout(5000);
    ExternalAccounts.create(validExternalAccount)
      .error(function(error){
        assert.strictEqual(error instanceof Error, true);
        assert.strictEqual(error.severity, 'ERROR');
        assert.strictEqual(error.detail, 'Key (address)=(3J98t1WpEZ73CNmQviecrnyiWrnqRhWNLy) already exists.');
        done();
      });
  });

  after(function(done) {
    externalAccount.destroy().then(done);
  });

});
