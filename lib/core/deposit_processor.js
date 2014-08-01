
var gateway = require(__dirname+'/../../');

function DepositProcessor(deposit) {
  this.deposit = deposit;
  logger.info('deposit:recorded', deposit.toJSON());
}

DepositProcessor.prototype = {
  processDeposit: function(callback) {
    var self = this;
    // Look up deposit external account record
    gateway.data.models.externalAccounts.find({ where: {
      id: self.deposit.external_account_id
    }}).complete(function(error, account) {
      if (error) {
        logger.error('deposit:failed', error);
        return callback(error, null);
      }
      // Find independent address associated with user
      gateway.data.models.rippleAddresses.find({ where: { 
        user_id: account.user_id,
        type: 'independent'
      }}).complete(function(error, address){
        if (error) {
          logger.error('deposit:failed', error);
          return callback(error, null);
        }
        // Create outgoing ripple payment transaction
        gateway.data.models.rippleTransactions.create({
          to_amount: self.deposit.amount * (1 - gateway.config.get('DEPOSIT_FEE')),
          to_currency: self.deposit.currency,
          to_issuer: gateway.config.get('COLD_WALLET'),
          from_amount: self.deposit.amount,
          from_currency: self.deposit.currency,
          from_issuer: gateway.config.get('COLD_WALLET'),
          to_address_id: address.id,
          from_address_id: gateway.config.get('HOT_WALLET').id,
          state: 'outgoing',
          external_transaction_id: self.deposit.id
        }).complete(function(error, payment) {
          if (error) {
            logger.error('deposit:failed', error);
            return callback(error, null);
          }
          // Remove original deposit record from queue
          self.outgoingPayment = payment;
          logger.info('outgoing:payment:queued', payment.toJSON());
          gateway.api.finalizeDeposit({
            id: self.deposit.id,
            ripple_transaction_id: payment.id
          }, function(error, deposit){
            if (error) {
              logger.error('deposit:finalize:error', error);
            } else {
              logger.info('deposit:finalized', deposit.toJSON());
            }
            callback(error, deposit);
          });
        });
      });
    });
  }   
};

module.exports = DepositProcessor;
