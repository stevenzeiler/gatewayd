const SqlMqWorker = require('sql-mq-worker');
const gatewayd = require(process.env.GATEWAYD_PATH || __dirname+'/../');

const ExternalTransaction = gatewayd.data.models.externalTransactions;
const GatewayTransaction = gatewayd.data.models.gatewayTransactions;
const RippleTransaction = gatewayd.data.models.rippleTransactions;

var worker = new SqlMqWorker({
  Class: ExternalTransaction,
  predicate: { where: {
    deposit: true,
    status: 'invoice'
  }},
  job: function(deposit, callback) {
    logger.info('deposits:invoice:popped', deposit.toJSON());
    GatewayTransaction.find({ where: {
      external_transaction_id: deposit.id 
    }}) 
    .then(function(gatewaydTransaction) {
      if (!gatewaydTransaction) {
        return deposit.updateAttributes({
          status: 'failed'
        }).complete(callback);
      }
      RippleTransaction.find(gatewaydTransaction.ripple_transaction_id)
      .then(function(rippleTransaction) {
        if (!rippleTransaction) {
          return deposit.updateAttributes({
            status: 'failed'
          }).complete(function() {
            gatewaydTransaction.updateAttributes({
              status: 'failed'
            }).complete(callback);
          });
        }
        rippleTransaction.updateAttributes({
          state: 'outgoing'
        })
        .then(function() {
          return gatewaydTransaction.updateAttributes({
            state: 'complete'
          })
          .then(function() {
            deposit.updateAttributes({
              status: 'complete'
            })
            .complete(callback);
          }) 
        })
        .error(callback);
      })
    })
    .error(function(error) {
      deposit.updateAttributes({ status: 'failed' })
      .complete(callback)
    });
  }
});

worker.start();

