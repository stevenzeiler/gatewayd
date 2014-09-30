var dbm = require('db-migrate');
var type = dbm.dataType;
var async = require("async");

exports.up = function(db, callback) {
  async.series([
    function(next){
      db.addColumn('external_accounts', 'address', {
        type: 'string',
        notNull: true,
        unique: true
      }, next);

    },
    function(next){
      db.addColumn('external_accounts', 'type', {
        type: 'string',
        notNull: true
      }, next);
    }
  ], callback);
};

exports.down = function(db, callback) {
  async.series([
    function(next){
      db.removeColumn('external_accounts', 'address', next);
    },
    function(next){
      db.removeColumn('external_accounts', 'type', next);
    }
  ], callback);
};

