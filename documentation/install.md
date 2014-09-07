# Ripple Gateway Installation Instructions

The following are for a clean build of Ubuntu 13.10. If you have any problems please create an issue.

All of these commands assume your are in the base of the cloned project directory (e.g. ~/gatewayd).

## Install

### [Node.js](http://stackoverflow.com/questions/16302436/install-nodejs-on-ubuntu-12-10) and dependencies

    sudo apt-get -y install git python-software-properties python g++ make libpq-dev
    sudo add-apt-repository -y ppa:chris-lea/node.js
    sudo apt-get -y update
    sudo apt-get -y install nodejs postgresql postgresql-client

### Install gatewayd's dependencies using NPM:

    sudo npm install --global pg pm2 grunt grunt-cli forever db-migrate jshint
    npm install --save

### Configure [Postgres](https://help.ubuntu.com/community/PostgreSQL)

Create the postgres user for gatewayd:

    sudo psql -U postgres -c "create user gatewayd_user with password 'password'"

Create the database and grant the created user as owner:

    sudo psql -U postgres -c "create database gatewayd_db with owner gatewayd_user encoding='utf8'"

### Edit config/config.js with created postgres credentials

    ...
    'DATABASE_URL': 'postgres://gatewayd_user:password@localhost:5432/gatewayd_db',
    ...

### Copy lib/data/database.example.json to lib/data/database.json and put your database configuration there. ( your DATABASE_URL )

    ...
    'development': {
      'ENV': 'postgres://gatewayd_user:password@localhost:5432/gatewayd_db'
    }
    ...


### Use Grunt to configure the postgres database

    grunt migrate

## Running gatewayd

The executable is located at bin/gateway:

    bin/gateway start

## Configure gatewayd

Once gatewayd is installed, [configure your gateway](./setup.md) wallets and server
