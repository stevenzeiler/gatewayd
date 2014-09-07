FROM jaesharp/orli-ubuntu-1204-chef-client-d
MAINTAINER Ripple Labs Infrastructure Team "ops@ripplelabs.com"

RUN apt-get -y update

ADD env/chef /srv/chef
ADD env/dev/chef-solo.json /srv/chef/chef-solo.json
ADD env/dev/chef-solo.rb /srv/chef/chef-solo.rb

RUN cd /srv/chef && /opt/chef/embedded/bin/berks install --path /srv/chef/cookbooks
RUN ls -r /srv/chef/cookbooks
RUN chef-solo -c /srv/chef/chef-solo.rb -j /srv/chef/chef-solo.json

RUN npm install -g supervisor
RUN apt-get install -y libpq-dev

RUN mkdir -p /srv/ripple/ripple-gateway
WORKDIR /srv/ripple/ripple-gateway

