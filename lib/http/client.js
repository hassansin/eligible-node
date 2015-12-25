var Promise = require('bluebird').Promise,
  extend = require('extend'),
  util = require('util'),
  debug = util.debuglog('eligible'),
  Config = require('./config'),
  errors = require('../errors'),
  pkg = require('../../package.json'),
  os = require('os');

var request = Promise.promisifyAll(require('request').defaults({
  headers: getDefaultHeaders()
}), { multiArgs: true });

function handleResponse (response, body){
  if(response.statusCode === 401){
    return new Promise.reject( new errors.AuthenticationError(' Authentication or authorization error. Mostly due to invalid api_key or provider need enrollment with payer.', response.statusCode ) ); 
  }
  else if(response.statusCode === 404 || response.statusCode === 400){
    return new Promise.reject( new errors.InvalidRequestError('Not Found', response.statusCode ) ); 
  }
  else if(response.statusCode === 400){
    return new Promise.reject( new errors.InvalidRequestError('Bad request, invalid or missing parameters.', response.statusCode ) ); 
  }
  else if(response.statusCode !== 200){
    return new Promise.reject( new errors.APIError(body, response.statusCode ) ); 
  }
  try{
    return new Promise.resolve(JSON.parse(body));
  }
  catch(e){
    return new Promise.reject( new errors.APIErrorResponseError(e.message, 0, body) ); 
  }
}

function getDefaultHeaders(){
  var headers = {};  
  headers.Accept = 'application/json';
  headers['Accept-Charset'] = 'UTF-8';  
  headers['X-Eligible-Client-User-Agent'] = JSON.stringify({
    'os.name': os.platform(),
    'os.arch': os.arch(),
    'os.version': os.release(),
    'node.version': process.version,
    'lang': 'nodejs',
  });
  return headers;
}

function getHeaders(config){
  var headers = {};
  headers['User-Agent'] = 'Eligible/' + config.getApiVersion() + ' NodeJSBindings/' + pkg.version ;
  headers['Eligible-Version'] = config.getApiVersion();
  return headers;
}


module.exports = function( method, uri, params, config){
  params = params || {};

  if(!(config instanceof Config) || !config.getApiKey() ){
    return new Promise.reject( new errors.AuthenticationError('No API key provided.', 0) ); 
  }

  var url = config.getApiBase() + '/' + config.getApiVersion() + '/' + uri;
  
  extend(params, {
    'api_key': config.getApiKey(),
    test: config.isTest()
  });

  var options = {
    headers : getHeaders(config)
  };
  debug('requesting %s', url); 
  debug('request params:', params);

  return exports[method](url, params, options);  
};

exports.get = function(url, params, options){
  options.qs = params;

  return request.getAsync(url, options)
  .catch(function(error) {
    return new Promise.reject( new errors.APIConnectionError(error.message) );
  })
  .spread(function(response, body) {
    return handleResponse(response, body);
  });
};

exports.post = function(url, params, options){
  options.formData = params;

  return request.postAsync(url, options)
  .catch(function(error) {
    return new Promise.reject( new errors.APIConnectionError(error.message) );
  })
  .spread(function(response, body) {
    return handleResponse(response, body);
  });
};


exports.put = function(url, params, options){
  options.formData = params;

  return request.putAsync(url, options)
  .catch(function(error) {
    return new Promise.reject( new errors.APIConnectionError(error.message) );
  })
  .spread(function(response, body) {
    return handleResponse(response, body);
  });
};


exports.delete = function(url, options){

  return request.deleteAsync(url, options)
  .catch(function(error) {
    return new Promise.reject( new errors.APIConnectionError(error.message) );
  })
  .spread(function(response, body) {
    return handleResponse(response, body);
  });
};
