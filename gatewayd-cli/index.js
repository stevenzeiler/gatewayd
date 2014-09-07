#!/usr/bin/env node
const config = require(__dirname+'/../gatewayd-config');
const program = require('commander');
const exec = require('child_process').exec;

program
  .version('4.0.0-alpha')

program
  .command('start')
  .description('start gatewayd application server and worker processes.')
  .action(function() {
    exec('cd '+config.get('GATEWAYD_PATH')+' && ls', function(error, output) {
      console.log(output);
    });
  });

program
  .command('stop')
  .description('stop the gatewayd application server and worker processes')
  .action(function() {
    console.log('stop gatewayd');
  });

program
  .command('restart')
  .description('restart the gatewayd application server and worker processes')
  .action(function() {
    console.log('restart gatewayd');
  });

program
  .command('reload')
  .description('reload the gatewayd application server and worker processes')
  .action(function() {
    console.log('reload gatewayd');
  });

program
  .command('migrate:create <migration_name>')
  .description('create a new migration file to alter the database schema')
  .action(function(migrationName) {
    console.log('create new migration named '+migrationName);
  });
  
program
  .command('migrate:up')
  .description('run all pending database migrations')
  .action(function() {
    console.log('run all pending migrations sequentially');
  });

program
  .command('migrate:down')
  .description('roll back the most recently run database migration')
  .action(function() {
    console.log('roll back a single migration');
  });

program
  .command('config:set <key> <value>')
  .description('set an item in the gatewayd configuration database')
  .action(function(key, value) {
    console.log('set config '+key+' to equal '+value);
  });

program
  .command('config:get <key>')
  .description('get an item from the gatewayd configuration database')
  .action(function(key) {
    console.log('set config item: '+key);
  });

program.parse(process.argv);

