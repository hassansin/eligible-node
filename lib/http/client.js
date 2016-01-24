var Promise = require('bluebird'),
  extend = require('extend'),
  util = require('util'),
  debug = util.debuglog('eligible'),
  Config = require('./config'),
  errors = require('../errors'),
  pkg = require('../../package.json'),
  os = require('os');

var request = require('request').defaults({
  headers: getDefaultHeaders(),
});

// Certificate fingerprint for gds.eligibleapi.com
var FINGERPRINT = '79:D6:2E:8A:9D:59:AE:68:73:72:F8:E7:13:45:C7:6D:92:52:7F:AC';

function handleResponse(response, body) {
  var error;

  // Try parsing JSON
  try {
    body = JSON.parse(body);
  }
  catch (e) {
    // Invalid JSON for 200 status
    if (response.statusCode === 200) {
      return new Promise.reject(
        new errors.APIResponseError(e.message, 0, body)
      );
    }
  }

  if (response.statusCode === 401) {
    error = new Promise.reject(
      new errors.AuthenticationError('Authentication' +
      ' or authorization error. Mostly due to invalid api_key or provider' +
      ' need enrollment with payer.',response.statusCode, body)
    );
  } else if (response.statusCode === 404) {
    error = new Promise.reject(
      new errors.InvalidRequestError(
        'Not Found',
        response.statusCode,
        body
      ));
  } else if (response.statusCode === 400) {
    error = new Promise.reject(
      new errors.InvalidRequestError(
        'Bad request, invalid or missing parameters.',
        response.statusCode,
        body
      ));
  } else if (response.statusCode !== 200) {
    error = new Promise.reject(
      new errors.APIError(
        body,
        response.statusCode,
        body
      ));
  }
  if (error) {
    return error;
  }

  // Valid JSON response for 200 status

  // Sometimes, for 200 status code, there are errors for invalid parameters
  if ((body.errors || body.error) && !body.success) {
    return new Promise.reject(
      new errors.InvalidRequestError(
        'Bad request, invalid or missing parameters.',
        400,
        body
      ));
  }

  return new Promise.resolve(body);
}

function getDefaultHeaders() {
  var headers = {};
  headers.Accept = 'application/json';
  headers['Accept-Charset'] = 'UTF-8';
  headers['X-Eligible-Client-User-Agent'] = JSON.stringify({
    'os.name': os.platform(),
    'os.arch': os.arch(),
    'os.version': os.release(),
    'node.version': process.version,
    lang: 'nodejs',
  });
  return headers;
}

function getHeaders(config) {
  var headers = {};
  headers['User-Agent'] = 'Eligible/' + config.getApiVersion() +
    ' NodeJSBindings/' + pkg.version ;
  headers['Eligible-Version'] = config.getApiVersion();
  return headers;
}


module.exports = function(method, uri, params, config) {
  params = params || {};

  if (!(config instanceof Config) || !config.getApiKey()) {
    return new Promise.reject(
      new errors.AuthenticationError('No API key provided.', 0)
    );
  }

  var url = config.getApiBase() + '/' + config.getApiVersion() + '/' + uri;
  // jshint camelcase: false
  // jscs:disable requireCamelCaseOrUpperCaseIdentifiers
  extend(params, {
    api_key: config.getApiKey(),
    test: String(config.isTest()),
  });

  var options = {
    headers: getHeaders(config),
  };
  return exports[method](url, params, options);
};

exports.request = function(options) {
  debug('request params:', options);
  return new Promise(function(resolve, reject) {
    request(options, function(error, response, body) {
      if (error) {
        return reject(new errors.APIConnectionError(error.message));
      }
      return resolve(handleResponse(response, body));
    })
    .on('response', function(response) {
      if (process.env.NODE_ENV === 'testing') {
        return;
      }

      if (!response.socket.authorized) {
        response.request.abort();
        return reject(new errors.APIConnectionError('Failed to authorize the' +
          ' connection: '.response.socket.authorizationError));
      }
      var fingerprint = response.socket.getPeerCertificate().fingerprint;
      debug('fingerprint %s', fingerprint);

      if (fingerprint !== FINGERPRINT) {
        response.request.abort();
        return reject(
          new errors.APIConnectionError('SSL fingerprint mismatch.')
        );
      }
    });
  });
};

exports.get = function(url, params, options) {
  options.qs = params;
  options.url = url;
  options.method = 'GET';

  return exports.request(options);

};

exports.post = function(url, params, options) {
  options.body = JSON.stringify(params);
  options.url = url;
  options.method = 'POST';
  return exports.request(options);
};


exports.put = function(url, params, options) {
  options.body = JSON.stringify(params);
  options.url = url;
  options.method = 'PUT';

  return exports.request(options);
};


exports.delete = function(url, options) {
  options.url = url;
  options.method = 'DELETE';

  return exports.request(options);
};
