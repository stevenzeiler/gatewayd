var SqlMqWorker = require('sql-mq-worker');
var PolicyEngine = require(__dirname+'/../lib/core/policy_engine.js');
var policyEngine = new PolicyEngine();

module.exports = function(gatewayd) {

  var worker = new SqlMqWorker({
    Class: gatewayd.data.models.externalTransactions,
    predicate: { where: {
      deposit: true,
      status: 'incoming'
    }},
    job: function(deposit, next) {
      gatewayd.logger.info('incoming deposit', deposit.toJSON());
      policyEngine.determinePolicy(deposit)
      .then(function(policy) {
        return policy.apply(deposit).then(next);
      })
      .error(function(error) {
        deposit.setData('error', error);
        deposit.updateAttributes({ status: 'failed' })
        .complete(next);
      });
    }
  });

  worker.start();

}

