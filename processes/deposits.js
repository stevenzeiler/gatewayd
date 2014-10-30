var SqlMqWorker = require('sql-mq-worker');
var DepositProcessor = require(__dirname+'/../lib/core/deposit_processor.js');

module.exports = function(gatewayd) {
  var gatewayd = require(__dirname+'/../');

  var worker = new SqlMqWorker({
    Class: gatewayd.data.models.externalTransactions,
    predicate: { where: {
      deposit: true,
      status: 'queued'
    }},
    job: function(deposit, callback) {
      gatewayd.logger.info('deposits:queued:popped', deposit.toJSON());
      var depositProcessor = new DepositProcessor(deposit);
      depositProcessor.processDeposit(callback);
    }
  });

  worker.start();

  gatewayd.logger.info('Processing external transactions in the "queued" state');
}
