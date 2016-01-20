var Config = require('../lib/http/config'),
    expect = require('chai').expect,
    errors = require('../lib/errors'),
    nock = require('nock'),
    client = require('../lib/http/client');

var config, host;

describe('Client', function() {
  before(function() {
    config = new Config('foobar');
    host = config.getApiBase() + '/' + config.getApiVersion();
    process.env.NODE_ENV = 'testing';
  });

  it('should throw AuthenticationError when Config object not provided',
    function(done) {
      client('get', '/foo', null)
        .catch(function(e) {
          expect(e).to.be.an.instanceOf(errors.AuthenticationError);
          done();
        })
        .catch(done);
    });

  it('should throw AuthenticationError when api_key not provided',
    function(done) {
      client('get', '/foo', null, new Config())
        .catch(function(e) {
          expect(e).to.be.an.instanceOf(errors.AuthenticationError);
          done();
        })
        .catch(done);
    });

  it('should throw AuthenticationError when HTTP status code is 401',
    function(done) {
      var responseBody = 'Could not authenticate you. Please re-try with a' +
        ' valid API key.';

      nock(host)
      .get('/foo')
      .query(true)
      .reply(401, responseBody);

      client('get', 'foo', null, config)
        .catch(function(e) {
          expect(e).to.be.an.instanceOf(errors.AuthenticationError);
          expect(e.code).to.eql(401);
          expect(e.response).to.eql(responseBody);
          done();
        })
        .catch(done);
    });

  it('should throw InvalidRequestError when HTTP status code is 404',
    function(done) {

      nock(host)
      .get('/foo')
      .query(true)
      .reply(404, 'Not Found');

      client('get', 'foo', null, config)
        .catch(function(e) {
          expect(e).to.be.an.instanceOf(errors.InvalidRequestError);
          expect(e.code).to.eql(404);
          expect(e.message).to.eql('Not Found');
          done();
        })
        .catch(done);
    });

  it('should throw InvalidRequestError when HTTP status code is 400',
    function(done) {

      nock(host)
      .get('/foo')
      .query(true)
      .reply(400, 'Bad request, invalid or missing parameters.');

      client('get', 'foo', null, config)
        .catch(function(e) {
          expect(e).to.be.an.instanceOf(errors.InvalidRequestError);
          expect(e.code).to.eql(400);
          expect(e.message)
            .to.eql('Bad request, invalid or missing parameters.');
          done();
        })
        .catch(done);
    });

  it('should throw APIError when HTTP status code is unknown',
    function(done) {
      var responseBody = 'Connection time out or payer is ' +
        'unable to respond to the request.';

      nock(host)
      .get('/foo')
      .query(true)
      .reply(408, responseBody);

      client('get', 'foo', null, config)
        .catch(function(e) {
          expect(e).to.be.an.instanceOf(errors.APIError);
          expect(e.message).to.eql(responseBody);
          expect(e.response).to.eql(responseBody);
          expect(e.code).to.eql(408);
          done();
        })
        .catch(done);
    });


  it('should throw APIResponseError when response is not JSON parsable',
    function(done) {

      nock(host)
      .get('/foo')
      .query(true)
      .reply(200, 'OK');

      client('get', 'foo', null, config)
        .catch(function(e) {
          expect(e).to.be.an.instanceOf(errors.APIResponseError);
          expect(e.response).to.eql('OK');
          done();
        })
        .catch(done);
    });

  it('should throw APIConnectionError',
    function(done) {

      nock(host)
      .get('/foo')
      .query(true)
      .replyWithError('something awful happened');

      client('get', 'foo', null, config)
        .catch(function(e) {
          expect(e).to.be.an.instanceOf(errors.APIConnectionError);
          done();
        })
        .catch(done);
    });
});
