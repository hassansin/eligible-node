var Config = require('../lib/http/config');
var assert = require('chai').assert;


describe('Config', function() {
  before(function() {
    process.env.ELIGIBLE_IS_TEST = 'true';
  });

  it('should initialize with string value', function() {
    var config = new Config('foo');
    assert.strictEqual('foo', config.getApiKey());
  });

  it('should initialize with object value', function() {
    var config = new Config({
      apiKey: 'bar',
      isTest: true,
    });
    assert.strictEqual('bar', config.getApiKey());
    assert.strictEqual(true, config.isTest());
  });

  it('should initialize with environment variable', function() {
    var config = new Config();
    assert.strictEqual(process.env.ELIGIBLE_API_KEY, config.getApiKey());
    assert.notEqual(process.env.ELIGIBLE_IS_TEST, config.isTest());
    assert.strictEqual(Boolean(process.env.ELIGIBLE_IS_TEST), config.isTest());
  });

  it('should set new api key', function() {
    var config = new Config('foo');
    config.setApiKey('bar');
    assert.strictEqual('bar', config.getApiKey());
  });

  it('should set test mode', function() {
    var config = new Config('foo');
    config.setTest(true);
    assert.strictEqual(true, config.isTest());

    config.setTest('true');
    assert.strictEqual(true, config.isTest());

    config.setTest('false');
    assert.strictEqual(true, config.isTest());
  });

  it('should get api version', function() {
    var config = new Config();
    assert.strictEqual(config._apiVersion, config.getApiVersion());
  });

  it('should get api base', function() {
    var config = new Config();
    assert.strictEqual(config.API_BASE, config.getApiBase());
  });

  it('should not be able to change api base', function() {
    var config = new Config();
    config.API_BASE = 'www.example.com';
    assert.notEqual(config.API_BASE, 'www.example.com');
  });

});
