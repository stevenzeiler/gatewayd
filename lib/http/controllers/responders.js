
module.exports.success = function(response, data, code) {
  var status = code || 200;
  var body = data || {};
  body.success = true;
  repsonse.status(status)
  .send(body);
}

module.exports.error = function(response, error, code) {
  var status = code || 500;
  body.success = false;
  body.error = error;
  response.status(status)
  .send(body);
}

