const config = require(__dirname+'/../gatewayd-config/');
var knex = require('knex');

if (!config.get('DATABASE')) {
  knex = knex({
    client: 'sqlite3',
    connection: {
      filename: config.get('GATEWAYD_PATH')+"/gatewayd.sqlite"
    }
  });
}

const bookshelf = require('bookshelf')(knex);
module.exports = bookshelf;

