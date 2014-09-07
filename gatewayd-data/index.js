const bookshelf = require('./bookshelf.js');

var Address = bookshelf.Model.extend({
  tableName: 'addresses'
});

module.exports = function(gatewayd) {
  gatewayd.Address = Address;
}

