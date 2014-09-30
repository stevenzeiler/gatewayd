var dbm = require('db-migrate');
var type = dbm.dataType;

exports.up = function(db, callback) {
  db.changeColumn('external_accounts', 'name', {
    notNull: false
  }, callback);
};

exports.down = function(db, callback) {
  db.changeColumn('external_accounts', 'name', {
    notNull: true
  }, callback);
};
