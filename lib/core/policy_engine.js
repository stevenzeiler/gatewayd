const Promise = require('bluebird');
const requireAll = require('require-all');
const policies = requireAll(__dirname+'/../../config/policies/');

function PolicyEngine() { 
  var engine = this;
  this.policiesOrder = [
    'invoice_policy',
    'bridge_policy',
    'user_policy',
    'no_policy'
  ]

  this.policies = [];
  this.policiesOrder.forEach(function(name) {
    engine.policies.push({
      name: name,
      policy: policies[name]
    });
  });
}

PolicyEngine.prototype.determinePolicy = function determinePolicy(payment) {
  var match;
  var _this = this;
  return new Promise(function(resolve, reject) {
    var series = []
    var policyMatch;
    _this.policies.ForEach(function(policy) { 
      var asyncPolicy = Promise.promisify(policy);
      series.push(function(next) {
        if (policyMatch) {
          return next();
        }
        asyncPolicy.doesApply(payment)
        .then(function() {
          policyMatch = policy;
        })
        .error(next);
      })
    })
    async.series(series, function(error) {
      if (error) {
        return
      } else {
        resolve(policy);
      }
    });
  });
}

module.exports = PolicyEngine;

