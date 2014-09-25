var GatewayTransaction = require(__dirname+'/../../../../lib/data').models.gatewayTransactions;
const responders = require(__dirname+'/../responders.js');

module.exports.index = function(request, response){
  GatewayTransaction.findAll({
    where: request.query
  })
  .then(function() {
    responders.success(response, {
      gateway_transactions: gateway_transactions
    });
  })
  .error(function(error) {
    responders.error(response, error);
  })
}

module.exports.show = function(req, res){
  GatewayTransaction.find(request.params.id)
  .then(function(transaction) {
    if (transaction) {
      responders.success(response, {
        gateway_transaction: transaction
      }, 200);
    } else {
      responders.error(response, "record not found", 404);
    }
  })
  .error(function(error) {
    responders.error(response, error);
  });
}

module.exports.update = function(request, response) {
  GatewayTransaction.find(request.params.id)
  .then(function(gatewayTransaction) {
    if (gatewayTransaction) {
      return gatewayTransaction.updateAttributes(request.body)
      .then(function(gatewayTransaction) {
        responders.success(response, {
          gateway_transaction: gateway_transaction
        });
      });
    } else {
      repsondError(response, 'record not found', 404)
    }
  })
  .error(function(error) {
    responders.error(repsonse, error);
  })
}

module.exports.destroy = function(request, response) {
  GatewayTransaction.find(request.params.id)
  .then(function(gatewayTransaction) {
    if (gatewayTransaction) {
      return gatewayTransaction.destroy().then(function() {
        responders.success(response, {});
      });
    } else {
      responders.error(response, 'record not found', 404);
    }
  })
  .error(function(error) {
    responders.error(response, error);
  })
}

module.exports.create = function(request, response) {
  GatewayTransaction.create(request.body)
  .then(function(gatewayTransaction){
    responders.success(response, {
      gateway_transaction: gateway_transaction
    });
  })
  .error(function(error) {
    responders.error(response, error);
  });
}

